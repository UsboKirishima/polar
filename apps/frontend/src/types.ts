export type Role = 'USER' | 'ADMIN';

export interface Avatar {
    id: string;
    url: string
    createdAt: string;
    updatedAt: string;
    userId: string | undefined;
    user: User | undefined;
}

export interface Banner {
    id: string;
    url: string
    createdAt: string;
    updatedAt: string;
    userId: string | undefined;
    user: User | undefined;
}

export interface User {
    id: string;
    email: string;
    role: Role;
    likes: Like[];
    createdAt: Date;
    updatedAt: Date;
    profile: {
        createdAt: Date;
        avatarId: string;
        avatar: Avatar;
        username: string,
        dateOfBirth: Date,
        fullName: string,
        banner: Banner,
        bannerId: string,
        bio: string
    }
}

export interface Category {
    id: number;
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