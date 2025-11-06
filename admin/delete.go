/* DELETE command */
package admin

import (
	"io"
	"net/http"
)

/* The callback function that handle the user account deletation */
func deleteUser(userId string, reason string) {
	res, err := http.Get("")

	if err != nil {
		errMessage("Failed to perform GET: %v", err)
		return
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		errMessage("Invalid status code: ", res.StatusCode)
		return
	}

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		errMessage("Failed to read response body: %v", err)
		return
	}

	infoMessage("Status: ", res.Status)
	infoMessage("Result: %v", string(bodyBytes))
}

/* Core func to delete a post */
func deletePost(postId string, reason string) {

}

/* Core func to delete a comment by given id */
func deleteComment(commentId string, reason string) {

}
