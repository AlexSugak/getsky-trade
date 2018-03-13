package errors

import (
	"strings"
)

// DbDuplicateEntry corresponds to an db error that specifies duplicating of data
const DbDuplicateEntry = "Error 1062: "
const duplicateEntryPropertyKey = "for key "

// IsDbValidationError checks if the error is db validation error
func IsDbValidationError(err error) bool {
	return strings.HasPrefix(err.Error(), DbDuplicateEntry)
}

// DatabaseErrorResponse parses database error string to user friendly error
func DatabaseErrorResponse(err error) ValidationError {
	errorResponse := make([]ValidationErrorResponse, 0)

	if !IsDbValidationError(err) {
		return ValidationError{Errors: errorResponse}
	}

	if strings.HasPrefix(err.Error(), DbDuplicateEntry) {
		message := strings.TrimSuffix(err.Error(), DbDuplicateEntry)
		key := strings.Replace(strings.Split(message, duplicateEntryPropertyKey)[1], "'", "", -1)
		errorResponse = append(errorResponse, ValidationErrorResponse{
			Key:     key,
			Message: message,
		})
	}

	return ValidationError{Errors: errorResponse}
}
