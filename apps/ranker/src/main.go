package main

import (
	"log"
	"ranker/src/controllers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	/* Initializing the database connection */
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error during loading file .env %v", err)
	}

	db := connectDB()
	defer db.Close()

	/* Initialize controllers */
	postsController := controllers.PostController{
		DB: db,
	}
	recommendationController := controllers.RecommendationController{
		DB: db,
	}

	/* Initializing the REST API */
	router := gin.Default()

	router.GET("/hello", apiHello)
	router.GET("/posts", postsController.ApiGetAllPosts)
	router.GET("/recommendations", recommendationController.ApiGetRecommendations)

	router.Run("localhost:8080")
}
