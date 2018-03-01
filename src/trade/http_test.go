package trade

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/AlexSugak/getsky-trade/src/util/logger"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type FakeAuthenticator struct {
	mock.Mock
}

func (fa *FakeAuthenticator) VerifyPassword(username string, password string) (bool, error) {
	if username == "testuser" {
		return true, nil
	}

	return false, nil
}

func TestAPIInfoHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		url            string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "success",
			method:         "GET",
			url:            "/api",
			expectedStatus: 200,
			expectedBody:   `{"name":"trade API","description":"trade API provides endpoints to enable posting and searching Skycoin buy and sell adverts","version":1}`,
		},
		{
			name:           "wrong method",
			method:         "POST",
			url:            "/api",
			expectedStatus: 405,
			expectedBody:   "",
		},
	}

	for _, tc := range tests {
		name := fmt.Sprintf("test case: %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, nil)

		require.NoError(t, err)

		w := httptest.NewRecorder()
		server := &HTTPServer{}
		handler := server.setupRouter()

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
	}
}

func TestAuthenticateHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		contentType    string
		url            string
		body           string
		expectedStatus int
	}{
		{
			name:           "should validate content type",
			method:         "POST",
			contentType:    "application/xml",
			url:            "/api/users/authenticate",
			expectedStatus: http.StatusUnsupportedMediaType,
		},
		{
			name:           "should not accept non json body",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users/authenticate",
			body:           `<foo />`,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "should validate user and password",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users/authenticate",
			body:           `{"username": "foo", "password": "bar"}`,
			expectedStatus: http.StatusUnauthorized,
		},
		{
			name:           "should return OK",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users/authenticate",
			body:           `{"username": "testuser", "password": "foo"}`,
			expectedStatus: 200,
		},
	}

	for _, tc := range tests {
		name := fmt.Sprintf("test case: %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, strings.NewReader(tc.body))
		require.NoError(t, err)
		req.Header.Set("Content-Type", tc.contentType)

		a := &FakeAuthenticator{}

		w := httptest.NewRecorder()
		server := &HTTPServer{authenticator: a, log: logger.InitLogger()}
		handler := server.setupRouter()

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
	}
}
