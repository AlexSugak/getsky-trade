package errors

import (
	"bytes"
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
			Key:     makeFirstLowerCase(key),
			Message: "It already exists in a database.",
		})
	}

	return ValidationError{Errors: errorResponse}
}

func makeFirstLowerCase(s string) string {
	if len(s) < 2 {
		return strings.ToLower(s)
	}

	bts := []byte(s)

	lc := bytes.ToLower([]byte{bts[0]})
	rest := bts[1:]

	return string(bytes.Join([][]byte{lc, rest}, nil))
}
