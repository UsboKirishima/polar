package controllers

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type PostController struct {
	DB *sql.DB
}

func (pc *PostController) ApiGetAllPosts(c *gin.Context) {
}
