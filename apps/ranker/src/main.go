package main

import (
	"log"

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

	/* Initializing the REST API */
	router := gin.Default()

	router.GET("/hello", apiHello)
	router.GET("/posts", apiHello)

	router.Run("localhost:8080")
}
