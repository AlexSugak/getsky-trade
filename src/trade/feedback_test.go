package trade

import (
	"bytes"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	tradedb "github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/src/mail"
	"github.com/AlexSugak/getsky-trade/src/util/logger"
	"github.com/AlexSugak/getsky-trade/src/util/test"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/require"
	validator "gopkg.in/go-playground/validator.v9"
)

type MailerMock struct{}

// SendFeedback sends mail to the feedback address
func (m MailerMock) SendFeedback(l *mail.Letter) error {
	return nil
}

// SendMail sends a letter
func (m MailerMock) SendMail(l *mail.Letter) error {
	return nil
}

func TestPostFeedback(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		contentType    string
		body           []byte
		url            string
		expectedBody   string
		expectedStatus int
	}{
		{
			name:           "should validate content type",
			method:         "POST",
			contentType:    "application/xml",
			body:           []byte(``),
			url:            "/api/feedback",
			expectedStatus: http.StatusUnsupportedMediaType,
			expectedBody:   "Invalid content type, expected application/jsonInvalid json request body: EOF",
		},
		{
			name:           "should validate format of the request entity",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(``),
			url:            "/api/feedback",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "Invalid json request body: EOF",
		},
		{
			name:           "should validate mandatory fields of the entity",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(`{"name":"test user","email":"test@email.com","subject":"test subject","message":"test message"}`),
			url:            "/api/feedback",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `[{"key":"Recaptcha","message":"is required"}]`,
		},
		{
			name:           "should validate recapcha code",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(`{"name":"test user","email":"test@email.com","subject":"test subject","message":"test message","recaptcha":"invalid_code"}`),
			url:            "/api/feedback",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `[{"key":"recaptcha","message":"is not valid"}]`,
		},
		{
			name:           "should send feedback form to the feedback email address",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(`{"name":"test user","email":"test@email.com","subject":"test subject","message":"test message","recaptcha":"pass"}`),
			url:            "/api/feedback",
			expectedStatus: http.StatusOK,
			expectedBody:   ``,
		},
	}

	for _, tc := range tests {
		name := fmt.Sprintf("test case: BuyAdvertHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, bytes.NewBuffer(tc.body))
		req.Header.Add("Content-type", tc.contentType)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		u := tradedb.NewUsers(sql)
		server := &HTTPServer{board: s, users: u, checkRecaptcha: FakeRecaptchaChecker, log: logger.InitLogger(), mailer: MailerMock{}}
		server.validate = validator.New()
		server.serverTime = ServerTimeMock{}
		handler := server.setupRouter(test.StubSecure)

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
	}
}
