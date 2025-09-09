export interface User {
    id: string;
    email: string;
    profile: {
        username: string,
        dateOfBirth: Date,
        fullName: string
    }
}

export interface Category {
    name: string;
    posts: Post[];
}

export interface Like {
    post: Post;
    postId: string;
    user: User;
    userId: string;
}

export interface PostComment {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    text: string;
    post: Post;
    postId: string;
    user: User;
    userId: string;
}

export interface Post {
    id: string;
    text: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    author: User;
    categories: Category[];
    comments: PostComment[];
    likes: Like[];
}