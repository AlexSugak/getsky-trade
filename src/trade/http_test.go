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

	"github.com/jmoiron/sqlx"

	tradedb "github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/src/util/logger"
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

func insertSQL(cmd string, args ...interface{}) int64 {
	c := fmt.Sprintf(cmd, args...)

	res, err := db.Exec(c)
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
		name := fmt.Sprintf("test case: AuthenticateHandler %s", tc.name)
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
			body:           `{"email":"foo","username":"foo","password":"1","timezone":"1","countryCode":"US","city":"1","postalCode":"1","distanceUnits":"1","currency":"USD"}`,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "should return OK and insert user",
			method:         "POST",
			contentType:    "application/json",
			url:            "/api/users",
			body:           `{"email":"foo1@bar.baz","username":"foo1","password":"1","timezone":"1","countryCode":"US","city":"1","postalCode":"1","distanceUnits":"1","currency":"USD"}`,
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
		handler := server.setupRouter()

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

func TestAdvertDetailsHandler(t *testing.T) {
	tests := []struct {
		name           string
		method         string
		url            string
		expectedBody   string
		expectedStatus int
	}{
		{
			name:           "should return response when request is valid",
			method:         "GET",
			url:            "/api/postings/1",
			expectedStatus: http.StatusOK,
			expectedBody:   `{"id":1,"type":2,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"EUR","additionalInfo":"","travelDistance":25,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"}`,
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

	userID := insertSQL(`INSERT INTO getskytrade.Users (UserName, Email, PasswordHash, Timezone, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ("bob", "bob@bob.com", "foo", "WST", "US", "CA", "Los Angeles", "", "mi", "USD", 1)`)
	execSQL(fmt.Sprintf(`INSERT INTO getskytrade.Adverts (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (2, %d, 100, null, null, null, "EUR", "", 25, "km", "GR", null, "Athens", "", 1, 1, 1, 1, 0, "2018-03-06");`, userID))

	for _, tc := range tests {
		name := fmt.Sprintf("test case: AdvertDetailsHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, nil)

		require.NoError(t, err)

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		server := &HTTPServer{board: s}
		handler := server.setupRouter()

		handler.ServeHTTP(w, req)
		actualBody := strings.TrimSuffix(w.Body.String(), "\n")
		require.Equal(t, tc.expectedStatus, w.Code, name)
		require.Equal(t, tc.expectedBody, actualBody, name)
	}

	clearTables()
}
