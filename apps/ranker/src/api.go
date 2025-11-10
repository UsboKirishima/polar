package main

import (
	"github.com/gin-gonic/gin"
)

func apiHello(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}
