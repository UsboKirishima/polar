package controllers

import (
	"database/sql"
	"ranker/src/models"

	"github.com/gin-gonic/gin"
)

type PostController struct {
	DB *sql.DB
}

func (pc *PostController) ApiGetAllPosts(c *gin.Context) {
	posts, err := models.FetchAllPosts(pc.DB)

	if err != nil {
		c.JSON(200, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(200, posts)
}
