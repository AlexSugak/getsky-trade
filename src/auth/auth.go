package auth

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

// Authenticator provides authentication methods
type Authenticator interface {
	VerifyPassword(string, string) error
}

// GetToken creates new JWT token from user name
func GetToken(name string) (string, error) {
	// TODO: hide secret
	// TODO: update to RS256
	signingKey := []byte("keymaker")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name": name,
	})
	tokenString, err := token.SignedString(signingKey)
	return tokenString, err
}

// VerifyToken checks if JWT token is valid
func VerifyToken(tokenString string) (jwt.Claims, error) {
	signingKey := []byte("keymaker")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err != nil {
		return nil, err
	}
	return token.Claims, err
}

// Middleware checks auth token before calling next http handler
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		tokenString := r.Header.Get("Authorization")
		if len(tokenString) == 0 {
			w.WriteHeader(http.StatusUnauthorized)
			_, err := w.Write([]byte("Missing Authorization Header"))
			if err != nil {
				http.Error(w, err.Error(), 500)
			}
			return
		}
		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)
		claims, err := VerifyToken(tokenString)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			_, err = w.Write([]byte("Error verifying JWT token: " + err.Error()))
			if err != nil {
				http.Error(w, err.Error(), 500)
			}
			return
		}
		name := claims.(jwt.MapClaims)["name"].(string)

		r.Header.Set("name", name)

		next.ServeHTTP(w, r)
	})
}
