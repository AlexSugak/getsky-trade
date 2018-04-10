package httputil

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/AlexSugak/getsky-trade/src/errors"
	"github.com/sirupsen/logrus"
)

// StatusError represents http handler error, includes original error and http status code to return
type StatusError struct {
	Err  error
	Code int
}

// Implement error interface
func (se StatusError) Error() string {
	return se.Err.Error()
}

// APIHandler is a custom handler function used internally to define api endpoint handlers
type APIHandler func(w http.ResponseWriter, r *http.Request) error

// ValidateContentType validates request's Content-Type and returns error if it does not match expected value
func ValidateContentType(r *http.Request, expectedType string) error {
	if r.Header.Get("Content-Type") != expectedType {
		return StatusError{
			Err:  fmt.Errorf("Invalid content type, expected %s", expectedType),
			Code: http.StatusUnsupportedMediaType,
		}
	}
	return nil
}

// ErrorHandler wraps APIHandler and converts it to http.Handler by handling any returned error
func ErrorHandler(log logrus.FieldLogger, h APIHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)
		if err != nil {
			switch e := err.(type) {
			case StatusError:
				log.Errorf("%s: HTTP %d - %s", r.URL, e.Code, e)
				http.Error(w, e.Error(), e.Code)
			case errors.ValidationError:
				log.Errorf("%s: HTTP 400 - %s", r.URL, e.Error())
				w.WriteHeader(http.StatusBadRequest)
				err := json.NewEncoder(w).Encode(e.Errors)

				if err != nil {
					http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
				}
			default:
				log.Errorf("Error in handler %s - %s", r.URL, err)
				http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			}
		}
	}
}

// JSONHandler wraps Handler and adds json content type
func JSONHandler(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		h(w, r)
	}
}

// AcceptJSONHandler wraps Handler and declines requests with not supported content-type
func AcceptJSONHandler(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		contentType := r.Header.Get("Content-Type")
		if (r.Method == "POST" || r.Method == "PUT") && !strings.ContainsAny(contentType, "application/json") {
			w.WriteHeader(http.StatusUnsupportedMediaType)
			_, err := w.Write([]byte("Invalid content type, expected application/json"))
			if err != nil {
				return
			}
		}

		h(w, r)
	}
}
