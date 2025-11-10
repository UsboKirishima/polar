package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

/* Initialize and returns the database instance */
func connectDB() *sql.DB {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("Failed to find DATABASE_URL environment variable")
	}

	/* Sanitize the DATABASE_URL removing the prefix */
	dsn := strings.TrimPrefix(dbURL, "mysql://")

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error while opening the database connection %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Error while pinging the database (Check credentials in .env) %v", err)
	}

	fmt.Println("Successfully connected to database!")

	db.SetMaxOpenConns(20) // Max connections open
	db.SetMaxIdleConns(10) // Max idle connections
	return db
}

type Post struct {
	ID       string
	Text     string
	AuthorID string
}

/* Provides all the posts in database */
func fetchAllPosts(db *sql.DB) ([]Post, error) {
	query := "SELECT id, text, authorId FROM Post"
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("Error while fetching posts: %w", err)
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post

		if err := rows.Scan(&p.ID, &p.Text, &p.AuthorID); err != nil {
			return nil, fmt.Errorf("Error while scanning line: %w", err)
		}
		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Error during interaction with lines: %w", err)
	}

	return posts, nil
}
