import { z } from "zod";
import type { Express } from "express";
import { PostBgColor } from "../generated/prisma";

// ------------------- Profile Schema -------------------
const profileBaseSchema = {
    username: z.string().min(4, { message: "username must be at least 4 characters long" }).max(20, {
        message: "username cannot be longer than 20 characters",
    }),
    dateOfBirth: z.coerce.date().min(new Date("01/01/1900"), { message: "invalid date of birth" }).max(new Date(Date.now()), {
        message: "Invalid date of birth",
    }),
    fullName: z.string().max(50, { message: "full name cannot be longer than 50 characters" }),
    bio: z.string().max(125, { message: "biography cannot be longer than 125 characters" }).optional(),
};

export const profileSchema = z.object(profileBaseSchema);

// ------------------- User Schema Login -------------------

const userBaseSchema = {
    email: z.string().email({ message: "invalid email address" }),
    password: z.string().min(8, { message: "password must be at least 8 characters long" }).max(50, {
        message: "password cannot be longer than 50 characters",
    }),
    profile: profileSchema,
};

export const userSchema = z.object(userBaseSchema);

// ------------------- Post schema -------------------

export const categoryNameSchema = z.string().max(50, { message: "category name cannot be longer than 50 characters" });
export const categorySchema = z.object({
    name: categoryNameSchema
});

export const commentTextSchema = z.string()
    .min(10, { message: "comment must be at least 10 characters long" })
    .max(255, { message: "comment text cannot be longer than 255 characters" });

export const commentSchema = z.object({
    text: commentTextSchema
});

const postBaseSchema = {
    text: z.string()
        .min(10, { message: "post content must be at least 10 characters long" })
        .max(512, { message: "content cannot be longer than 30 characters" }),
    categories: categorySchema.array().default([]),
    /* Check color provided */
    color: z.string().refine((val) => val in PostBgColor, {
        message: `Invalid color, try (${Object.keys(PostBgColor).join(", ")}) `,
    }).optional()
};

export const postSchema = z.object(postBaseSchema);

export const userIdSchema = z.string().uuid({ message: "userId does not respect the UUID regex." });
export type TUserId = z.infer<typeof userIdSchema>;

export const updatePostSchema = z.object({
    postId: userIdSchema,
    post: postSchema,
});

export const postIdSchema = z.string().uuid({ message: 'postId does not respect the UUID regex.' })

export const commentRequestSchema = z.object({
    postId: postIdSchema,
    text: commentTextSchema
})

export const commentIdSchema = z.string().uuid({ message: 'commentId does not respect the UUID regex.' });
export const commentEditSchema = z.object({
    commentId: commentIdSchema,
    newText: commentTextSchema
})

export const categoryIdSchema = z.number({ message: 'categoryId does not respect the numerical id.' });

// ------------------- Some useful types -------------------


export const usernameSchema = profileBaseSchema.username;
export type TUsername = z.infer<typeof usernameSchema>;

export const postContentSchema = postBaseSchema.text;
export type TPostContent = z.infer<typeof postSchema>;

export const fileSchema = z.custom<Express.Multer.File>(
    (val) => val && typeof val === "object" && "buffer" in val && "mimetype" in val,
    { message: "Invalid file upload" }
);

// ------------------- Export types -------------------

export type TUserSchema = z.infer<typeof userSchema>;
export type TProfileSchema = z.infer<typeof profileSchema>;
export type TPostSchema = z.infer<typeof postSchema>;
export type TPostCategory = z.infer<typeof categorySchema>;
export type TPostCommentSchema = z.infer<typeof commentSchema>;

