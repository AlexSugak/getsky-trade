package errors

import (
	"fmt"
)

// ValidationErrorResponse is entity that contains property name and its error message
type ValidationErrorResponse struct {
	Key     string `json:"key"`
	Message string `json:"message"`
}

// ValidationError represents validation error
type ValidationError struct {
	Errors []ValidationErrorResponse
}

func (e ValidationError) Error() string {
	return fmt.Sprint(e.Errors)
}

// CreateSingleValidationError creates ValidationError for single error
func CreateSingleValidationError(key string, message string) ValidationError {
	errorResponse := make([]ValidationErrorResponse, 0)

	ve := ValidationErrorResponse{
		Key:     key,
		Message: message,
	}
	errorResponse = append(errorResponse, ve)

	return ValidationError{Errors: errorResponse}
}
