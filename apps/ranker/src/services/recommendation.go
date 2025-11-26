package services

import (
	"database/sql"
	"fmt"
	"log"
	"math"
	"ranker/src/models"
)

//
// recommendation.go - Recommendation engine for Polar.
//
// This module implements a basic recommendation system using cosine similarity
// to suggest posts to users based on their interactions (currently, post authorship).
//
// Data structures:
//
// User - Represents a user in the system.
//
//	id - Unique identifier for the user.
//
// UserVector - A vector representation of a user's interactions with posts.
//
//	UserID - The ID of the user.
//	Vector - A map where keys are Post IDs and values indicate interaction (1 for authored, 0 otherwise).
//
// Functions:
//
// FetchUserPostVectors - Fetches all posts and constructs user-post interaction vectors.
//
//	db - Database connection.
//	Returns a map of UserID to UserVector, and an error if any.
//
// CosineSimilarity - Calculates the cosine similarity between two user vectors.
//
//	vec1 - First user vector.
//	vec2 - Second user vector.
//	Returns the cosine similarity score.
//
// GetRecommendations - Generates a list of recommended post IDs for a given user.
//
//	db - Database connection.
//	targetUserID - The ID of the user for whom to generate recommendations.
//	Returns a slice of recommended Post IDs, and an error if any.

type User struct {
	ID string
}

type UserVector struct {
	UserID string
	Vector map[string]float64 // Key: PostID, Value: 1.0 if interacted, 0.0 otherwise
}

// FetchUserPostVectors fetches all posts and constructs user-post interaction vectors.
func FetchUserPostVectors(db *sql.DB) (map[string]UserVector, error) {
	posts, err := models.FetchAllPosts(db)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch all posts: %w", err)
	}

	userVectors := make(map[string]UserVector)
	allPostIDs := make(map[string]struct{}) // To keep track of all unique post IDs

	// Initialize user vectors and collect all unique post IDs
	for _, post := range posts {
		if _, exists := userVectors[post.AuthorID]; !exists {
			userVectors[post.AuthorID] = UserVector{
				UserID: post.AuthorID,
				Vector: make(map[string]float64),
			}
		}
		userVectors[post.AuthorID].Vector[post.ID] = 1.0 // User authored this post
		allPostIDs[post.ID] = struct{}{}
	}

	// Ensure all user vectors have entries for all posts (0.0 if no interaction)
	for userID, uv := range userVectors {
		for postID := range allPostIDs {
			if _, exists := uv.Vector[postID]; !exists {
				userVectors[userID].Vector[postID] = 0.0
			}
		}
	}

	return userVectors, nil
}

// CosineSimilarity calculates the cosine similarity between two user vectors.
func CosineSimilarity(vec1, vec2 UserVector) float64 {
	dotProduct := 0.0
	magnitude1 := 0.0
	magnitude2 := 0.0

	// Ensure both vectors have the same set of keys for comparison
	// This assumes FetchUserPostVectors has already normalized vectors to include all post IDs
	for postID, val1 := range vec1.Vector {
		val2 := vec2.Vector[postID] // Will be 0.0 if not present, due to normalization
		dotProduct += val1 * val2
		magnitude1 += val1 * val1
		magnitude2 += val2 * val2
	}

	magnitude1 = math.Sqrt(magnitude1)
	magnitude2 = math.Sqrt(magnitude2)

	if magnitude1 == 0 || magnitude2 == 0 {
		return 0.0 // Avoid division by zero
	}

	return dotProduct / (magnitude1 * magnitude2)
}

// GetRecommendations generates a list of recommended post IDs for a given user.
func GetRecommendations(db *sql.DB, targetUserID string) ([]string, error) {
	userVectors, err := FetchUserPostVectors(db)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user post vectors: %w", err)
	}

	targetUserVector, exists := userVectors[targetUserID]
	if !exists {
		return nil, fmt.Errorf("target user %s not found", targetUserID)
	}

	// Calculate similarity with all other users
	similarities := make(map[string]float64)
	for userID, uv := range userVectors {
		if userID == targetUserID {
			continue // Don't compare user with themselves
		}
		similarities[userID] = CosineSimilarity(targetUserVector, uv)
	}

	// Find the most similar users
	// For simplicity, let's just pick users above a certain similarity threshold
	// In a real system, you might pick top N users or use more sophisticated ranking
	const similarityThreshold = 0.5 // Example threshold
	var similarUsers []string
	for userID, score := range similarities {
		if score > similarityThreshold {
			similarUsers = append(similarUsers, userID)
		}
	}

	if len(similarUsers) == 0 {
		log.Printf("No similar users found for %s above threshold %f", targetUserID, similarityThreshold)
		return []string{}, nil
	}

	// Collect posts from similar users that the target user hasn't interacted with
	recommendedPostIDs := make(map[string]struct{})
	for _, simUserID := range similarUsers {
		for postID, interaction := range userVectors[simUserID].Vector {
			if interaction == 1.0 { // If similar user authored this post
				// Check if target user has already interacted with this post
				if _, targetInteracted := targetUserVector.Vector[postID]; !targetInteracted || targetUserVector.Vector[postID] == 0.0 {
					recommendedPostIDs[postID] = struct{}{}
				}
			}
		}
	}

	var recommendations []string
	for postID := range recommendedPostIDs {
		recommendations = append(recommendations, postID)
	}

	return recommendations, nil
}
