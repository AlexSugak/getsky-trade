package errors

import (
	"fmt"
)

// ValidationErrorResponse is entity that contains property name and its error message
type ValidationErrorResponse struct {
	Property string
	Message  string
}

// ValidationError represents validation error
type ValidationError struct {
	Errors []ValidationErrorResponse
}

func (e ValidationError) Error() string {
	return fmt.Sprint(e.Errors)
}
