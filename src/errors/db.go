package errors

import (
	"strings"

	"github.com/go-sql-driver/mysql"
)

// DbDuplicateEntry corresponds to an db error that specifies duplicating of data
const DbDuplicateEntry = 1062
const duplicateEntryPropertyKey = "for key "

// DatabaseErrorResponse parses database error string to user friendly error
func DatabaseErrorResponse(err error) ValidationError {
	errorResponse := make([]ValidationErrorResponse, 0)

	me, ok := err.(*mysql.MySQLError)
	if !ok {
		return ValidationError{Errors: errorResponse}
	}

	if me.Number == DbDuplicateEntry {
		key := strings.Replace(strings.Split(me.Message, duplicateEntryPropertyKey)[1], "'", "", -1)

		errorResponse = append(errorResponse, ValidationErrorResponse{
			Key:     key,
			Message: me.Message,
		})
	}

	return ValidationError{Errors: errorResponse}
}
