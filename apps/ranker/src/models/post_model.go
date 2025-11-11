package models

import (
	"database/sql"
	"fmt"
)

type Post struct {
	ID       string
	Text     string
	AuthorID string
}

/* Provides all the posts in database */
func FetchAllPosts(db *sql.DB) ([]Post, error) {
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
