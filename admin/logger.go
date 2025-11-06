/* Simple console message handler */
package admin

import (
	"fmt"
	"os"
)

/* Simple log console message */
func logMessage(msg ...any) {
	fmt.Println("MESSAGE: ", msg)
}

/* Error logging that writes in stderr */
func errMessage(msg ...any) {
	fmt.Fprintf(os.Stderr, "ERROR: %v", msg)
}

/* Information console logging function */
func infoMessage(msg ...any) {
	fmt.Println("INFO: ", msg)
}
