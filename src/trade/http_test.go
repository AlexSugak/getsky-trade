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
	constr := fmt.Sprintf("%s:%s@(%s)/getskytrade?parseTime=true", user, password, host)
	db = initDb(constr)
	ensureTables()
	code := m.Run()
	clearTables()

	os.Exit(code)
}

func initDb(constr string) *sql.DB {
	d, err := sql.Open("mysql", constr)
	if err != nil {
		panic(err.Error())
	}
	return d
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

func execSQL(cmd string) {
	_, err := db.Exec("DELETE FROM `getskytrade`.`Adverts`;")
	if err != nil {
		panic(err.Error())
	}
}

func clearTables() {
	fmt.Println("clearing tables")
	execSQL("DELETE FROM `getskytrade`.`Adverts`;")
	execSQL("DELETE FROM `getskytrade`.`Users`;")
	execSQL("ALTER TABLE `getskytrade`.`Adverts` AUTO_INCREMENT = 1;")
	execSQL("ALTER TABLE `getskytrade`.`Users` AUTO_INCREMENT = 1;")
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
			body:           `{"email":"foo@bar.baz","username":"foo","password":"1","timezone":"1","countryCode":"US","city":"1","postalCode":"1","distanceUnits":"1","currency":"USD"}`,
			expectedStatus: http.StatusOK,
			username:       "foo",
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
			err := sql.Get(user, "SELECT u.UserName FROM getskytrade.Users u WHERE u.UserName = ?", tc.username)
			require.NoError(t, err)
			require.Equal(t, tc.username, user.UserName)
		}
	}
}
