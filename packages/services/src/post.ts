import { PostBgColor } from "@polar/db";
import { TPostCategory, TPostCommentSchema, TPostSchema } from "@polar/types/zod";
import { db } from "@polar/db";
import { cacheManager } from "./cache";

const CACHE_TTL = 60; // Caching expiration (60 seconds)
const CACHE_KEYS = {
    post: (postId: string) => `post:${postId}`,
    postsByUser: (userId: string) => `posts:user:${userId}`,
    allPosts: "posts:all",
    comment: (commentId: string) => `comment:${commentId}`,
    allCategories: "categories:all",
    categoryById: (categoryId: number) => `category:id:${categoryId}`,
    categoryByName: (categoryName: string) => `category:name:${categoryName}`
}

type GetPostById = Awaited<ReturnType<typeof __getPostByid>>;
type GetCommentById = Awaited<ReturnType<typeof __getCommentById>>;
type GetPostByUserId = Awaited<ReturnType<typeof __getPostsByUserId>>;
type GetAllPosts = Awaited<ReturnType<typeof __getAllPosts>>;
type GetAllCategories = Awaited<ReturnType<typeof __getAllCategories>>;
type GetCategoryById = Awaited<ReturnType<typeof __getCategoryById>>;
type GetCategoryByName = Awaited<ReturnType<typeof __getCategoryByName>>;

/**
 * Get post by post id
 */
export const __getPostByid = async (postId: string) => {
    return await db.post.findUnique({
        where: { id: postId, published: true },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            username: true,
                            fullName: true,
                            avatar: true,
                        },
                    },
                },
            },
            categories: true,
            comments: {
                where: {
                    published: true
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                            profile: {
                                include: {
                                    avatar: true
                                }
                            }
                        }
                    },

                },
            },
            likes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            profile: {
                                select: {
                                    username: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
};

export const __getCommentById = async (commentId: string) => {
    return await db.comment.findFirst({
        where: { id: commentId, published: true },
        include: {
            user: true
        }
    })
}

/**
 * Get all posts
 */
export const __getAllPosts = async () => {
    return await db.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            username: true,
                            fullName: true,
                            avatar: true,
                            bio: true
                        },
                    },
                },
            },
            categories: true,
            comments: {
                where: {
                    published: true
                }
            },
            likes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            role: true,
                            profile: {
                                select: { username: true },
                            },
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

/**
 * Get all posts by a given user id
 */
export const __getPostsByUserId = async (userId: string) => {
    return await db.post.findMany({
        where: { authorId: userId, published: true },
        include: {
            categories: true,
            comments: {
                where: {
                    published: true
                }
            },
            author: {
                select: {
                    id: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: {
                        include: {
                            avatar: true,
                        }
                    }
                }
            },
            likes: {
                include: {
                    user: {
                        select: {
                            id: true,
                            profile: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

export const __getAllCategories = async () => {
    return await db.category.findMany({
        select: {
            id: true,
            name: true,
            posts: {
                select: {
                    id: true
                }
            }
        },
    })
}

export const __getCategoryById = async (categoryId: number) => {
    return await db.category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            posts: {
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            profile: {
                                select: {
                                    username: true,
                                    fullName: true,
                                    bio: true
                                },
                            },
                        },
                    },
                    comments: {
                        where: {
                            published: true
                        }
                    },
                    likes: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    role: true,
                                    profile: {
                                        select: { username: true },
                                    },
                                },
                            },
                        },
                    },
                }
            }
        }
    })
}

export const __getCategoryByName = async (categoryName: string) => {
    return await db.category.findUnique({
        where: {
            name: categoryName
        },
        include: {
            posts: {
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            profile: {
                                select: {
                                    username: true,
                                    fullName: true,
                                    bio: true
                                },
                            },
                        },
                    },
                    comments: {
                        where: {
                            published: true
                        }
                    },
                    likes: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    role: true,
                                    profile: {
                                        select: { username: true },
                                    },
                                },
                            },
                        },
                    },
                }
            }
        }
    })
}

/**
 * Create new post by given post and user id
 */
export const createNewPost = async (
    userId: string,
    post: TPostSchema
) => {
    const newPost = await db.post.create({
        data: {
            text: post.text,
            authorId: userId,
            color: post.color as PostBgColor,
            categories: {
                connectOrCreate: post.categories.map((cat) => ({
                    where: { name: cat.name },
                    create: { name: cat.name },
                })),
            },
        },
        include: {
            categories: true,
            author: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            username: true,
                            fullName: true,
                        },
                    },
                },
            },
        },
    });

    await cacheManager.delete(CACHE_KEYS.postsByUser(userId));
    await cacheManager.delete(CACHE_KEYS.allPosts);

    await cacheManager.delete(CACHE_KEYS.allCategories);
    post.categories.forEach(async (cat) => {
        await cacheManager.delete(CACHE_KEYS.categoryByName(cat.name));
    });

    return newPost;
};

/**
 * Delete a post by given post id.
 * ================================
 * This function does not remove definitely the post,
 * but It sets the flag `published` to false.
 */
export const deletePost = async (postId: string) => {
    const postToDelete = await db.post.findUnique({
        where: { id: postId },
        select: { authorId: true }
    });

    if (!postToDelete) {
        throw new Error("Post not found.");
    }

    const result = await db.post.update({
        where: { id: postId },
        data: {
            published: false
        }
    });

    await cacheManager.delete(CACHE_KEYS.post(postId));
    await cacheManager.delete(CACHE_KEYS.postsByUser(postToDelete.authorId));
    await cacheManager.delete(CACHE_KEYS.allPosts);

    return result;
};

/**
 * Like a post by given post id
 * (Toggle-like behavior)
 */
export const likePost = async (postId: string, userId: string) => {
    const post = await db.post.findUnique({
        where: { id: postId, published: true },
        select: { authorId: true }
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    const existingLike = await db.like.findFirst({
        where: {
            postId,
            userId,
        },
    });

    let result;
    if (existingLike) {
        // Unlike -> delete the like record
        await db.like.delete({
            where: { id: existingLike.id },
        });

        result = { message: "Post unliked successfully" };
    } else {
        // Like -> create a new like record
        result = await db.like.create({
            data: {
                postId,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        profile: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
            },
        });
    }

    await cacheManager.delete(CACHE_KEYS.post(postId));
    await cacheManager.delete(CACHE_KEYS.postsByUser(post.authorId));
    await cacheManager.delete(CACHE_KEYS.allPosts);


    return result;
};

/**
 * Create a new post comment
 */
export const createNewComment = async (
    userId: string,
    comment: TPostCommentSchema,
    postId: string
) => {
    const post = await db.post.findUnique({
        where: { id: postId, published: true },
        select: { authorId: true }
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    const newComment = await db.comment.create({
        data: {
            userId: userId,
            text: comment.text,
            postId,
        },
        include: {
            post: true,
            user: true
        },
    });

    await cacheManager.delete(CACHE_KEYS.post(postId));
    await cacheManager.delete(CACHE_KEYS.postsByUser(post.authorId));
    await cacheManager.delete(CACHE_KEYS.allPosts);

    return newComment;
};

/**
 * Delete comment by given comment id
 */
export const deleteComment = async (commentId: string) => {
    const commentToDelete = await db.comment.findUnique({
        where: { id: commentId },
        select: { postId: true }
    });

    if (!commentToDelete) {
        throw new Error("Comment not found.");
    }

    const post = await db.post.findUnique({
        where: { id: commentToDelete.postId, published: true },
        select: { authorId: true }
    });

    if (!post) {
        throw new Error("Post for comment not found.");
    }

    //const result = await db.comment.delete({
    //    where: { id: commentId },
    //});

    const result = await db.comment.update({
        where: {
            id: commentId
        },
        data: {
            published: false
        }
    })

    await cacheManager.delete(CACHE_KEYS.comment(commentId));
    await cacheManager.delete(CACHE_KEYS.post(commentToDelete.postId));
    await cacheManager.delete(CACHE_KEYS.postsByUser(post.authorId));
    await cacheManager.delete(CACHE_KEYS.allPosts);

    return result;
};

/**
 * Get comment by given id
 */
export const getCommentById = async (commentId: string) => {
    const cacheKey = CACHE_KEYS.comment(commentId);
    const cached =
        await cacheManager.get<GetCommentById>(cacheKey);

    if (cached) {
        return cached;
    }

    const comment = await __getCommentById(commentId);

    if (comment) {
        await cacheManager.set(cacheKey, comment, {
            ttl: CACHE_TTL
        });
    }

    return comment;
}

/**
 * Get post by post id (Cache implementation)
 */
export const getPostByid = async (postId: string) => {
    const cacheKey = CACHE_KEYS.post(postId);
    const cached =
        await cacheManager.get<GetPostById>(cacheKey);

    if (cached) {
        return cached;
    }

    const post = await __getPostByid(postId);

    if (post) {
        await cacheManager.set(cacheKey, post, {
            ttl: CACHE_TTL
        });
    }

    return post;
};

/**
 * Get all posts by a given user id (Cache implementation)
 */
export const getPostsByUserId = async (userId: string) => {
    const cacheKey = CACHE_KEYS.postsByUser(userId);
    const cached =
        await cacheManager.get<GetPostByUserId>(cacheKey);

    if (cached) {
        return cached;
    }

    const posts = await __getPostsByUserId(userId);

    if (posts && posts.length > 0) {
        await cacheManager.set(cacheKey, posts, {
            ttl: CACHE_TTL
        });
    }

    return posts;
};

/**
 * Get all posts (Cache implementation)
 */
export const getAllPosts = async () => {
    const cacheKey = CACHE_KEYS.allPosts;
    const cached =
        await cacheManager.get<GetAllPosts>(cacheKey);

    if (cached) {
        return cached;
    }

    const posts = await __getAllPosts();

    if (posts && posts.length > 0) {
        await cacheManager.set(cacheKey, posts, {
            ttl: CACHE_TTL
        });
    }

    return posts;
};

/**
 * Get all categories (Cache implementation)
 */
export const getAllCategories = async () => {
    const cacheKey = CACHE_KEYS.allCategories;
    const cached =
        await cacheManager.get<GetAllCategories>(cacheKey);

    if (cached) {
        return cached;
    }

    const categories = await __getAllCategories();

    if (categories && categories.length > 0) {
        await cacheManager.set(cacheKey, categories, {
            ttl: CACHE_TTL
        });
    }

    return categories;
}

/**
 * Get category by given id (Cache implementation)
 */
export const getCategoryById = async (categoryId: number) => {
    const cacheKey = CACHE_KEYS.categoryById(categoryId);
    const cached =
        await cacheManager.get<GetCategoryById>(cacheKey);

    if (cached) {
        return cached;
    }

    const category = await __getCategoryById(categoryId);

    if (category) {
        await cacheManager.set(cacheKey, category, {
            ttl: CACHE_TTL
        });
    }

    return category;
}

/**
 * Get category by given name (Cache implementation)
 */
export const getCategoryByName = async (categoryName: string) => {
    const cacheKey = CACHE_KEYS.categoryByName(categoryName);
    const cached =
        await cacheManager.get<GetCategoryByName>(cacheKey);

    if (cached) {
        return cached;
    }

    const category = await __getCategoryByName(categoryName);

    if (category) {
        await cacheManager.set(cacheKey, category, {
            ttl: CACHE_TTL
        });
    }

    return category;
}

export const updatePost = async (postId: string, newPostInformation: TPostSchema) => {
    const post = await db.post.findUnique({
        where: { id: postId, published: true },
        select: { authorId: true, categories: true }
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    const result = await db.post.update({
        where: {
            id: postId
        },
        data: {
            text: newPostInformation.text,
            categories: {
                set: newPostInformation.categories.map((cat) => ({ name: cat.name }))
            }
        }
    })

    await cacheManager.delete(CACHE_KEYS.post(postId));
    await cacheManager.delete(CACHE_KEYS.postsByUser(post.authorId));
    await cacheManager.delete(CACHE_KEYS.allPosts);

    await cacheManager.delete(CACHE_KEYS.allCategories);
    post.categories.forEach(async (cat) => {
        await cacheManager.delete(CACHE_KEYS.categoryByName(cat.name));
    });
    newPostInformation.categories.forEach(async (cat) => {
        await cacheManager.delete(CACHE_KEYS.categoryByName(cat.name));
    });

    return result;
}

export const searchCategory = async (query: string, limit: number = 20) => {
    return await db.category.findMany({
        where: {
            name: {
                contains: query
            }
        },
        take: limit
    })
}