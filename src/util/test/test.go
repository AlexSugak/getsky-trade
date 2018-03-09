package test

import (
	"net/http"
)

// StubSecure is stub of trade.SecureDecorator that is used for integration testing
func StubSecure(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
	})
}
