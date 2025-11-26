package controllers

import (
	"database/sql"
	"net/http"
	"ranker/src/services"

	"github.com/gin-gonic/gin"
)

// Redis-style comments:
//
// recommendation_controller.go - Handles recommendation API requests.
//
// This module defines the controller for handling HTTP requests related to
// post recommendations. It interacts with the recommendation service to
// generate and return recommended posts for a given user.
//
// Data structures:
//
// RecommendationController - Controller for recommendation-related endpoints.
//
//	DB - Database connection pool.
//
// Functions:
//
// ApiGetRecommendations - Handles GET requests for user recommendations.
//
//	c - Gin context for the current HTTP request.
//	Expects a 'userID' query parameter.
//	Returns a JSON array of recommended post IDs or an error message.

type RecommendationController struct {
	DB *sql.DB
}

func (rc *RecommendationController) ApiGetRecommendations(c *gin.Context) {
	userID := c.Query("userID")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userID query parameter is required"})
		return
	}

	recommendations, err := services.GetRecommendations(rc.DB, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recommendations": recommendations})
}
