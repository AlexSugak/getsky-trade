package trade

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/AlexSugak/getsky-trade/src/util/test"
	"github.com/stretchr/testify/require"
)

func TestAPIInfoHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		url            string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "should not accept wrong method",
			method:         "POST",
			url:            "/api",
			expectedStatus: 405,
			expectedBody:   "",
		},
		{
			name:           "should return api info",
			method:         "GET",
			url:            "/api",
			expectedStatus: 200,
			expectedBody:   `{"name":"trade API","description":"trade API provides endpoints to enable posting and searching Skycoin buy and sell adverts","version":1}`,
		},
	}

	for _, tc := range tests {
		name := fmt.Sprintf("test case: APIInfoHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, nil)

		require.NoError(t, err)

		w := httptest.NewRecorder()
		server := &HTTPServer{}
		handler := server.setupRouter(test.StubSecure)

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
	}
}
