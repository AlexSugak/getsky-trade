package trade

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/AlexSugak/getsky-trade/db/models"

	tradedb "github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/src/util/logger"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/require"
	validator "gopkg.in/go-playground/validator.v9"
)

func setupPostMessageTests() (int64, func()) {
	userID := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('bob', 'bob@bob.com', 'foo', 0, 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName))
	userID2 := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('sam', 'sam@sam.com', 'foo', 0, 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName))

	advertID := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (1, %d, 100, null, null, null, 'EUR', '', 25, 'km', 'GR', null, 'Athens', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID))
	insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Messages` (Author, AdvertId, Body, CreatedAt, IsRead) VALUES (%d, %d, 'message_body', '2018-03-06', false)", dbName, userID2, advertID))
	insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Messages` (Author, AdvertId, Body, CreatedAt, IsRead, Recipient) VALUES (%d, %d, 'message_body_2', '2018-03-06', false, %d)", dbName, userID, advertID, userID2))

	return advertID, func() {
		clearTables()
	}
}

func stubAuthHeader(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("name", "bob")
		h.ServeHTTP(w, r)
	})
}

func TestPostNewMessage(t *testing.T) {
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
			url:            "/api/postings/{advertID}/messages",
			expectedStatus: http.StatusUnsupportedMediaType,
			expectedBody:   "Invalid content type, expected application/jsonInvalid json request body: EOF",
		},
		{
			name:           "should validate format of the request entity",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(``),
			url:            "/api/postings/{advertID}/messages",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "Invalid json request body: EOF",
		},
		{
			name:           "should validate mandatory fields of the entity",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(`{}`),
			url:            "/api/postings/{advertID}/messages",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `[{"key":"Body","message":"is required"}]`,
		},
		{
			name:           "should save message and return saved entity with 200 status",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(`{ "body":"message_body" }`),
			url:            "/api/postings/{advertID}/messages",
			expectedStatus: http.StatusOK,
			expectedBody:   `{"id":4,"author":1,"advertId":1,"body":"message_body","isRead":false,"createdAt":"2013-02-03T19:54:00Z","recipient":null}`,
		},
		{
			name:           "should save message and return saved entity with 200 status",
			method:         "POST",
			contentType:    "application/json",
			body:           []byte(`{ "body":"message_body", "recipient":2 }`),
			url:            "/api/postings/{advertID}/messages",
			expectedStatus: http.StatusOK,
			expectedBody:   `{"id":4,"author":1,"advertId":1,"body":"message_body","isRead":false,"createdAt":"2013-02-03T19:54:00Z","recipient":2}`,
		},
	}

	advertID, teardownTests := setupPostMessageTests()
	defer teardownTests()

	for _, tc := range tests {
		name := fmt.Sprintf("test case: TestPostNewMessage %s", tc.name)
		url := strings.Replace(tc.url, "{advertID}", fmt.Sprintf("%d", advertID), 1)
		req, err := http.NewRequest(tc.method, url, bytes.NewBuffer(tc.body))
		req.Header.Add("Content-type", tc.contentType)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		u := tradedb.NewUsers(sql)
		m := tradedb.NewMessages(sql)
		server := &HTTPServer{board: s, users: u, checkRecaptcha: FakeRecaptchaChecker, log: logger.InitLogger(), messages: m}
		server.validate = validator.New()
		server.serverTime = ServerTimeMock{}
		handler := server.setupRouter(stubAuthHeader)

		handler.ServeHTTP(w, req)
		if w.Code == 200 {
			expectedMsg := &models.Message{}
			err = json.Unmarshal([]byte(tc.expectedBody), expectedMsg)
			if err != nil {
				panic(err)
			}

			actualMsg := &models.Message{}
			err = json.NewDecoder(w.Body).Decode(actualMsg)
			if err != nil {
				panic(err)
			}

			expectedMsg.ID = actualMsg.ID
			require.Equal(t, expectedMsg, actualMsg)
		} else {
			require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
		}
		require.Equal(t, tc.expectedStatus, w.Code, name)
	}
}

func TestGetMessageAuthors(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		contentType    string
		url            string
		expectedBody   string
		expectedStatus int
	}{
		{
			name:           "should check format of the query string params",
			method:         "GET",
			contentType:    "application/json",
			url:            "/api/postings/not_a_number/messages-authors",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `id is not valid. id should be a number`,
		},
		{
			name:           "should restrict access to the adverts that were created by another users",
			method:         "GET",
			contentType:    "application/json",
			url:            "/api/postings/12/messages-authors",
			expectedStatus: http.StatusForbidden,
			expectedBody:   `You do not have rights to see this content`,
		},
		{
			name:           "should return authors of advert messages",
			method:         "GET",
			contentType:    "application/json",
			url:            "/api/postings/{advertID}/messages-authors",
			expectedStatus: http.StatusOK,
			expectedBody:   `["bob","sam"]`,
		},
	}

	advertID, teardownTests := setupPostMessageTests()
	defer teardownTests()

	for _, tc := range tests {
		name := fmt.Sprintf("test case: TestPostNewMessage %s", tc.name)
		url := strings.Replace(tc.url, "{advertID}", fmt.Sprintf("%d", advertID), 1)
		req, err := http.NewRequest(tc.method, url, nil)
		req.Header.Add("Content-type", tc.contentType)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		u := tradedb.NewUsers(sql)
		m := tradedb.NewMessages(sql)
		server := &HTTPServer{board: s, users: u, checkRecaptcha: FakeRecaptchaChecker, log: logger.InitLogger(), messages: m}
		server.validate = validator.New()
		server.serverTime = ServerTimeMock{}
		handler := server.setupRouter(stubAuthHeader)

		handler.ServeHTTP(w, req)

		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
		require.Equal(t, tc.expectedStatus, w.Code, name)
	}
}

func TestGetMessages(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		contentType    string
		url            string
		expectedBody   string
		expectedStatus int
	}{
		{
			name:           "should check format of the query string params",
			method:         "GET",
			contentType:    "application/json",
			url:            "/api/postings/not_a_number/messages/sam",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `id is not valid. id should be a number`,
		},
		{
			name:           "should restrict access to the adverts that were created by another users",
			method:         "GET",
			contentType:    "application/json",
			url:            "/api/postings/12/messages/sam",
			expectedStatus: http.StatusForbidden,
			expectedBody:   `You do not have rights to see this content`,
		},
		{
			name:           "should return authors of advert messages",
			method:         "GET",
			contentType:    "application/json",
			url:            "/api/postings/{advertID}/messages/sam",
			expectedStatus: http.StatusOK,
			expectedBody:   `[{"id":94,"author":2,"advertId":1,"body":"message_body","isRead":false,"createdAt":"2018-03-06T00:00:00Z","recipient":null},{"id":95,"author":1,"advertId":1,"body":"message_body_2","isRead":false,"createdAt":"2018-03-06T00:00:00Z","recipient":2}]`,
		},
	}

	advertID, teardownTests := setupPostMessageTests()
	defer teardownTests()

	for _, tc := range tests {
		name := fmt.Sprintf("test case: TestPostNewMessage %s", tc.name)
		url := strings.Replace(tc.url, "{advertID}", fmt.Sprintf("%d", advertID), 1)
		req, err := http.NewRequest(tc.method, url, nil)
		req.Header.Add("Content-type", tc.contentType)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		u := tradedb.NewUsers(sql)
		m := tradedb.NewMessages(sql)
		server := &HTTPServer{board: s, users: u, checkRecaptcha: FakeRecaptchaChecker, log: logger.InitLogger(), messages: m}
		server.validate = validator.New()
		server.serverTime = ServerTimeMock{}
		handler := server.setupRouter(stubAuthHeader)

		handler.ServeHTTP(w, req)

		if w.Code == 200 {
			fmt.Println(w.Body.String())
			actualMsgs := &[]models.Message{}
			err = json.NewDecoder(w.Body).Decode(actualMsgs)
			if err != nil {
				panic(err)
			}

			expectedMsgs := &[]models.Message{}
			err = json.Unmarshal([]byte(tc.expectedBody), expectedMsgs)
			if err != nil {
				panic(err)
			}

			require.Equal(t, len(*(expectedMsgs)), len(*(actualMsgs)), name)

			for i, m := range *(actualMsgs) {
				m.ID = (*expectedMsgs)[i].ID
				(*actualMsgs)[0].ID = (*expectedMsgs)[i].ID
				require.Equal(t, m, (*expectedMsgs)[i])
			}
		} else {
			require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
		}

		require.Equal(t, tc.expectedStatus, w.Code, name)
	}
}
