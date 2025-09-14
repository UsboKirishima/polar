import { TPostCategory, TPostCommentSchema, TPostSchema } from "../types/zod";
import { db } from "../utils/db";

/**
 * Create new post by given post and user id
 */
export const createNewPost = async (
    userId: string,
    post: TPostSchema,
    categories: TPostCategory[]
) => {
    return await db.post.create({
        data: {
            text: post.text,
            authorId: userId,
            categories: {
                connectOrCreate: categories.map((cat) => ({
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
};

/**
 * Delete a post by given post id
 */
export const deletePost = async (postId: string) => {
    return await db.post.delete({
        where: { id: postId },
    });
};

/**
 * Like a post by given post id
 * (Toggle-like behavior)
 */
export const likePost = async (postId: string, userId: string) => {
    const existingLike = await db.like.findFirst({
        where: {
            postId,
            userId,
        },
    });

    if (existingLike) {
        // Unlike -> delete the like record
        await db.like.delete({
            where: { id: existingLike.id },
        });

        return { message: "Post unliked successfully" };
    } else {
        // Like -> create a new like record
        return await db.like.create({
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
};

/**
 * Create a new post comment
 */
export const createNewComment = async (
    userId: string,
    comment: TPostCommentSchema,
    postId: string
) => {
    return await db.comment.create({
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
};

/**
 * Delete comment by given comment id
 */
export const deleteComment = async (commentId: string) => {
    return await db.comment.delete({
        where: { id: commentId },
    });
};

/**
 * Get comment by given id
 */
export const getCommentById = async (commentId: string) => {
    return await db.comment.findFirst({
        where: { id: commentId },
        include: {
            user: true
        }
    })
}

/**
 * Get post by post id
 */
export const getPostByid = async (postId: string) => {
    return await db.post.findUnique({
        where: { id: postId },
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
                        },
                    },
                },
            },
            categories: true,
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                            profile: true
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

/**
 * Get all posts by a given user id
 */
export const getPostsByUserId = async (userId: string) => {
    return await db.post.findMany({
        where: { authorId: userId },
        include: {
            categories: true,
            comments: true,
            author: {
                select: {
                    id: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: true
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

/**
 * Get all posts
 */
export const getAllPosts = async () => {
    return await db.post.findMany({
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
            categories: true,
            comments: true,
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

export const getAllCategories = async () => {
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

export const getCategoryById = async (categoryId: number) => {
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
                    comments: true,
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

export const getCategoryByName = async (categoryName: string) => {
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
                    comments: true,
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