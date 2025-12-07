/**
 * The Polar Algorithm
 * ===================
 *
 * Polar uses a basic recommendation algorithm based on scoring, friends, likes, and categories.
 * Below are the main rules that help filter and prioritize posts:
 *
 *  + Popularity  : Post score based on the fraction `(likes + comments) / (dateNow - dateOfCreation)`
 *  + Suggested   : Post matches most of the user's preferred categories.
 *  + Near        : Post is liked by some of the user's friends.
 *  + Trusted     : Post was created by one of the user's friends.
 *  + Secure      : Post shares categories with posts previously liked by the user.
 *  + Recent      : Post was created less than 1 day ago.
 *
 * Originally authored by: Davide Usberti
 *
 * Copyright (c) 2025-Present, Davide Usberti <usbertibox@gmail.com>
 * All rights reserved.
 */

/**
 * Scores (or weights) used to calculate a post's total score.
 * The final score determines whether the post is:
 * - `PASSED`  → returned in the output
 * - `REFUSED` → ignored
 */
export const SCORES: Record<string, number> = {
    POPOULARITY_SCORE: 0.7, // Balanced popularity impact
    SUGGESTED_SCORE: 0.8, // Strong match with user interests
    NEAR_SCORE: 0.5, // Liked by friends
    TRUSTED: 0.6, // Created by a friend
    SECURE: 0.9, // Matches categories of liked posts
    RECENT: 1.0, // Highest priority for freshness
}

/**
 * `NPOST_INPUT` defines the number of posts processed as input,
 * while `NPOST_OUTPUT` defines how many posts will be returned
 * by the algorithm.
 * ===================================================================
 * Increasing `NPOST_INPUT` and decreasing `NPOST_OUTPUT`
 * improves the accuracy but may increase processing time.
 */
export const NPOST_INPUT = 100
export const NPOST_OUTPUT = 50

/**
 * The limit that determinates if the post is `PASSED` or `REFUSED`
 * !ATTENTION! Valid just if you want to get a variable number of posts
 * in output
 */
export const SCORE_LIMIT: number = Number.NaN // To disable use `NaN`
