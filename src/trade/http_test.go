package trade

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/AlexSugak/getsky-trade/db/models"

	"github.com/jmoiron/sqlx"

	tradedb "github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/src/util/logger"
	"github.com/AlexSugak/getsky-trade/src/util/test"
	"github.com/mattes/migrate"
	"github.com/mattes/migrate/database/mysql"
	_ "github.com/mattes/migrate/source/file"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	validator "gopkg.in/go-playground/validator.v9"
)

type FakeAuthenticator struct {
	mock.Mock
}

func (fa *FakeAuthenticator) VerifyPassword(username string, password string) error {
	if username == "testuser" {
		return nil
	}

	return errors.New("wrong user or password")
}

const dbName = "getskytrade"

var db *sql.DB

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func TestMain(m *testing.M) {
	// user fallback to local mysql in docker, ENV VARs for testing on Travis
	user := getEnv("MYSQL_USER", "root")
	password := getEnv("MYSQL_PASSWORD", "root")
	host := getEnv("MYSQL_HOST", "0.0.0.0:3306")
	constr := fmt.Sprintf("%s:%s@(%s)/%s?parseTime=true&multiStatements=true", user, password, host, dbName)
	db = initDb(constr)
	ensureTables()
	clearTables()
	code := m.Run()

	os.Exit(code)
}

func initDb(constr string) *sql.DB {
	d, err := sql.Open("mysql", constr)
	if err != nil {
		panic(err.Error())
	}
	return d
}

func execSQL(cmd string, args ...interface{}) {
	c := fmt.Sprintf(cmd, args...)
	_, err := db.Exec(c)
	if err != nil {
		panic(err.Error())
	}
}

func insertSQL(cmd string) int64 {
	res, err := db.Exec(cmd)
	if err != nil {
		panic(err.Error())
	}

	id, err := res.LastInsertId()
	if err != nil {
		panic(err.Error())
	}

	return id
}

func ensureTables() {
	fmt.Println("creating schema")

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		panic(err.Error())
	}
	m, err := migrate.NewWithDatabaseInstance("file://../../db/schema", "mysql", driver)
	if err != nil {
		panic(err.Error())
	}
	err = m.Up()
	fmt.Println(err) // TODO: why migrate returns err if no change in schema?
}

func clearTables() {
	fmt.Println("clearing tables")
	execSQL("DELETE FROM `%s`.`Adverts`;", dbName)
	execSQL("DELETE FROM `%s`.`Users`;", dbName)
	execSQL("ALTER TABLE `%s`.`Adverts` AUTO_INCREMENT = 1;", dbName)
	execSQL("ALTER TABLE `%s`.`Users` AUTO_INCREMENT = 1;", dbName)
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
		name := fmt.Sprintf("test case: AuthenticateHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, strings.NewReader(tc.body))
		require.NoError(t, err)
		req.Header.Set("Content-Type", tc.contentType)

		a := &FakeAuthenticator{}

		w := httptest.NewRecorder()
		server := &HTTPServer{authenticator: a, log: logger.InitLogger()}
		handler := server.setupRouter(test.StubSecure)

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
	}
}

func TestRegisterHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		contentType    string
		url            string
		body           string
		expectedStatus int
		username       string
	}{
		{
			name:           "should validate content type",
			method:         "POST",
			contentType:    "application/xml",
			url:            "/api/users",
			expectedStatus: http.StatusUnsupportedMediaType,
		},
		{
			name:           "should not accept non json body",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users",
			body:           `<foo />`,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "should require fields",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users",
			body:           `{}`,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "should validate email",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users",
			body:           `{"email":"foo","username":"foo","password":"1","timezone":"1"}`,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "should return OK and insert user",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users",
			body:           `{"email":"foo1@bar.baz","username":"foo1","password":"1","timezone":"1"}`,
			expectedStatus: http.StatusOK,
			username:       "foo1",
		},
	}

	for _, tc := range tests {
		name := fmt.Sprintf("test case: RegisterHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, strings.NewReader(tc.body))
		require.NoError(t, err)
		req.Header.Set("Content-Type", tc.contentType)

		a := &FakeAuthenticator{}
		sql := sqlx.NewDb(db, "mysql")
		u := tradedb.NewUsers(sql)

		w := httptest.NewRecorder()
		server := &HTTPServer{authenticator: a, users: u, log: logger.InitLogger()}
		server.validate = validator.New()
		handler := server.setupRouter(test.StubSecure)

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)

		if tc.username != "" {
			user := &struct {
				UserName string `db:"UserName"`
			}{}
			cmd := fmt.Sprintf("SELECT u.UserName FROM %s.Users u WHERE u.UserName = ?", dbName)
			err := sql.Get(user, cmd, tc.username)
			require.NoError(t, err)
			require.Equal(t, tc.username, user.UserName)
		}
	}
}

func setupAdvertsTests() func() {
	userID := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, Timezone, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('bob', 'bob@bob.com', 'foo', 'WST', 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName))
	execSQL("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (1, %d, 100, null, null, null, 'EUR', '', 25, 'km', 'GR', null, 'Athens', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID)
	execSQL("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (2, %d, 100, null, null, null, 'USD', '', 30, 'km', 'GR', null, 'Athens', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID)

	return func() {
		clearTables()
	}
}

func TestAdverts(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		url            string
		expectedBody   string
		expectedStatus int
	}{
		{
			name:           "should return adverts which have type '1' (Sell type)",
			method:         "GET",
			url:            "/api/postings/sell/latest",
			expectedStatus: http.StatusOK,
			expectedBody:   `[{"id":1,"type":1,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"EUR","additionalInfo":"","travelDistance":25,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"}]`,
		},
		{
			name:           "should return adverts which have type '2' (Buy type)",
			method:         "GET",
			url:            "/api/postings/buy/latest",
			expectedStatus: http.StatusOK,
			expectedBody:   `[{"id":2,"type":2,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"USD","additionalInfo":"","travelDistance":30,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"}]`,
		},
		{
			name:           "should return response when request is valid",
			method:         "GET",
			url:            "/api/postings/1",
			expectedStatus: http.StatusOK,
			expectedBody:   `{"id":1,"type":1,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"EUR","additionalInfo":"","travelDistance":25,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"}`,
		},
		{
			name:           "should return 400 when id is not valid",
			method:         "GET",
			url:            "/api/postings/asd",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "id is not valid. id should be a number",
		},
		{
			name:           "should return 404 when advert doesn't exist",
			method:         "GET",
			url:            "/api/postings/0",
			expectedStatus: http.StatusNotFound,
			expectedBody:   "advert with such id doesn't exist",
		},
	}

	teardownTests := setupAdvertsTests()
	defer teardownTests()

	for _, tc := range tests {
		name := fmt.Sprintf("test case: LatestSellAdvertsHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, nil)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		server := &HTTPServer{board: s}
		handler := server.setupRouter(test.StubSecure)

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
	}
}

func setupUpdateUserTests() func() {
	execSQL("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, Timezone, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('bob', 'bob@bob.com', 'foo', 'WST', 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName)

	return func() {
		clearTables()
	}
}

func TestUpdateUserSettings(t *testing.T) {
	tests := []struct {
		name                 string
		method               string
		url                  string
		contentType          string
		body                 string
		expectedStatus       int
		expectedBody         string
		expectedUserSettings models.UserSettings
	}{
		{
			name:           "should validate content type",
			method:         "POST",
			contentType:    "application/xml",
			url:            "/api/me/settings",
			expectedStatus: http.StatusUnsupportedMediaType,
			expectedBody:   "Invalid content type, expected application/jsonInvalid json request body: EOF",
		},
		{
			name:           "should return 400 when json body is not valid",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/me/settings",
			body:           "<foo />",
			expectedStatus: http.StatusBadRequest,
			expectedBody:   "Invalid json request body: invalid character '<' looking for beginning of value",
		},
		{
			name:           "should return 400 when UpdateSettingsRequest entity doesn't have one of required fields",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/me/settings",
			body:           `{"timezone":"CET","countryCode":"GR","city":"Athens","postalCode":"0000","distanceUnits":"Athens","currency":"EUR"}`,
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `User info not valid: Key: 'UpdateSettingsRequest.UserName' Error:Field validation for 'UserName' failed on the 'required' tag`,
		},
		{
			name:           "should return 404 when the user doesn't exist",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/me/settings",
			body:           `{"Id":2,"username":"foo","email":"foo@foo.com","timezone":"CET","countryCode":"GR","city": "Athens","postalCode": "0000","distanceUnits":"Athens","currency": "USD"}`,
			expectedStatus: http.StatusNotFound,
			expectedBody:   "the user with the userName: 'foo' doesn't exist",
		},
		{
			name:           "should return 200 when operation successful",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/me/settings",
			body:           `{"username":"bob","timezone":"WST","countryCode":null,"city":"New York","postalCode":"9999","distanceUnits":"Athens","currency":"USD","stateCode":null}`,
			expectedStatus: http.StatusOK,
			expectedBody:   "",
			expectedUserSettings: models.UserSettings{
				UserName:      "bob",
				Timezone:      "WST",
				CountryCode:   models.JSONNullString{},
				City:          "New York",
				PostalCode:    "9999",
				DistanceUnits: "Athens",
				Currency:      "USD",
				StateCode:     models.JSONNullString{},
			},
		},
	}

	teardownTests := setupUpdateUserTests()
	defer teardownTests()

	for _, tc := range tests {
		name := fmt.Sprintf("test case: TestUpdateUserSettings %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, strings.NewReader(tc.body))
		req.Header.Set("Content-Type", tc.contentType)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		u := tradedb.NewUsers(sql)

		w := httptest.NewRecorder()
		server := &HTTPServer{users: u, log: logger.InitLogger()}
		server.validate = validator.New()

		handler := server.setupRouter(test.StubSecure)
		handler.ServeHTTP(w, req)

		require.Equal(t, tc.expectedStatus, w.Code, name)
		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)

		if tc.expectedUserSettings != (models.UserSettings{}) {
			userSettingds := &models.UserSettings{}

			cmd := fmt.Sprintf("SELECT u.UserName, u.Timezone, u.CountryCode, u.StateCode, u.City, u.PostalCode, u.DistanceUnits, u.Currency FROM %s.Users u WHERE u.UserName = ?", dbName)
			err := sql.Get(userSettingds, cmd, "bob")
			require.NoError(t, err)
			require.Equal(t, tc.expectedUserSettings, *userSettingds)
		}
	}
}
