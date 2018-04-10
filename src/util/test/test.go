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

// StubAuthHeader returns a stub of trade.SecureDecorator with specific userName
func StubAuthHeader(id string, userName string) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Header.Set("id", id)
			r.Header.Set("name", userName)
			h.ServeHTTP(w, r)
		})
	}
}
