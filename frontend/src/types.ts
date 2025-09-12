export type Role = 'USER' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    role: Role;
    likes: Like[];
    createdAt: Date;
    profile: {
        username: string,
        dateOfBirth: Date,
        fullName: string,
        bio: string
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