package errors

import (
	"fmt"

	validator "gopkg.in/go-playground/validator.v9"
)

// ValidatorErrorsResponse convert validator.ValidationErrors to ValidationError
func ValidatorErrorsResponse(errors validator.ValidationErrors) ValidationError {
	errorResponse := make([]ValidationErrorResponse, 0)

	for i := 0; i < len(errors); i++ {
		ve := ValidationErrorResponse{
			Key:     errors[i].Field(),
			Message: mapFieldErrorToErrorMessage(errors[i]),
		}
		errorResponse = append(errorResponse, ve)
	}

	return ValidationError{Errors: errorResponse}
}

func mapFieldErrorToErrorMessage(fe validator.FieldError) string {
	tag := fe.Tag()

	switch tag {
	case "required":
		return "is required"
	case "len":
		return fmt.Sprintf("length should be %s", fe.Param())
	case "max":
		return fmt.Sprintf("can't be more then %s", fe.Param())
	case "min":
		return fmt.Sprintf("can't be less then %s", fe.Param())
	case "oneof":
		return fmt.Sprintf("should be one of: %s", fe.Param())
	case "email":
		return fmt.Sprintf("string is not email address")
	default:
		return "unknown error"
	}
}
