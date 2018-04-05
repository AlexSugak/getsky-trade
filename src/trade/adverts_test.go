package trade

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"

	"github.com/jmoiron/sqlx"

	tradedb "github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/src/util/test"
	_ "github.com/mattes/migrate/source/file"
	"github.com/stretchr/testify/require"
)

func setupAdvertsTests() func() {
	userID := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('bob', 'bob@bob.com', 'foo', 0, 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName))
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

func setupMyAdvertsTests() func() {
	userID1 := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('bob', 'bob@bob.com', 'foo', 0, 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName))
	execSQL("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (1, %d, 100, null, null, null, 'EUR', '', 25, 'km', 'GR', null, 'Athens', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID1)
	execSQL("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (2, %d, 100, null, null, null, 'USD', '', 30, 'km', 'GR', null, 'Athens', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID1)

	userID2 := insertSQL(fmt.Sprintf("INSERT INTO `%s`.`Users` (UserName, Email, PasswordHash, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status) VALUES ('bib', 'bib@bib.com', 'foo', 0, 'US', 'CA', 'Los Angeles', '', 'mi', 'USD', 1)", dbName))
	execSQL("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (1, %d, 100, null, null, null, 'EUR', '', 25, 'km', 'US', null, 'United States of America', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID2)
	execSQL("INSERT INTO `%s`.`Adverts` (Type, Author, AmountFrom, AmountTo, FixedPrice, PercentageAdjustment, Currency, AdditionalInfo, TravelDistance, TravelDistanceUoM, CountryCode, StateCode, City, PostalCode, Status, TradeCashInPerson, TradeCashByMail, TradeMoneyOrderByMail, TradeOther, CreatedAt) VALUES (2, %d, 100, null, null, null, 'USD', '', 30, 'km', 'US', null, 'United States of America', '', 1, 1, 1, 1, 0, '2018-03-06')", dbName, userID2)

	execSQL("INSERT INTO `%s`.`Messages` (Author, AdvertId, Body, CreatedAt, Recipient, IsRead) VALUES (%d, 1, 'A text', '2018-03-06', null, 1)", dbName, userID2)
	execSQL("INSERT INTO `%s`.`Messages` (Author, AdvertId, Body, CreatedAt, Recipient, IsRead) VALUES (%d, 1, 'A text', '2018-03-06', %d, 1)", dbName, userID1, userID2)
	execSQL("INSERT INTO `%s`.`Messages` (Author, AdvertId, Body, CreatedAt, Recipient, IsRead) VALUES (%d, 1, 'A text', '2018-03-06', null, 0)", dbName, userID2)

	return func() {
		clearTables()
	}
}

func TestMyAdverts(t *testing.T) {
	tests := []struct {
		name           string
		userID         int
		method         string
		url            string
		expectedBody   string
		expectedStatus int
	}{
		{
			userID:         1,
			name:           "should return enquired adverts and posted adverts for user 1",
			method:         "GET",
			url:            "/api/postings/my",
			expectedStatus: http.StatusOK,
			expectedBody:   `{"myAdverts":[{"advert":{"id":1,"type":1,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"EUR","additionalInfo":"","travelDistance":25,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"},"newMessagesAmount":1,"totalMessagesAmount":2},{"advert":{"id":2,"type":2,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"USD","additionalInfo":"","travelDistance":30,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"},"newMessagesAmount":0,"totalMessagesAmount":0}],"enquiredAdverts":[]}`,
		},
		{
			userID:         2,
			name:           "should return enquired adverts and posted adverts for user 2",
			method:         "GET",
			url:            "/api/postings/my",
			expectedStatus: http.StatusOK,
			expectedBody:   `{"myAdverts":[{"advert":{"id":3,"type":1,"author":"bib","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"EUR","additionalInfo":"","travelDistance":25,"travelDistanceUoM":"km","countryCode":"US","stateCode":null,"city":"United States of America","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"},"newMessagesAmount":0,"totalMessagesAmount":0},{"advert":{"id":4,"type":2,"author":"bib","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"USD","additionalInfo":"","travelDistance":30,"travelDistanceUoM":"km","countryCode":"US","stateCode":null,"city":"United States of America","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"},"newMessagesAmount":0,"totalMessagesAmount":0}],"enquiredAdverts":[{"advert":{"id":1,"type":1,"author":"bob","tradeCashInPerson":true,"tradeCashByMail":true,"tradeMoneyOrderByMail":true,"tradeOther":false,"amountFrom":100,"amountTo":null,"fixedPrice":null,"percentageAdjustment":null,"currency":"EUR","additionalInfo":"","travelDistance":25,"travelDistanceUoM":"km","countryCode":"GR","stateCode":null,"city":"Athens","postalCode":"","status":1,"createdAt":"2018-03-06T00:00:00Z"},"newMessagesAmount":0,"totalMessagesAmount":1,"writtenSellMessagesAmount":2,"writtenBuyMessagesAmount":0}]}`,
		},
	}

	teardownTests := setupMyAdvertsTests()
	defer teardownTests()

	for _, tc := range tests {
		name := fmt.Sprintf("test case: TestMyAdvertsHandler %s", tc.name)
		req, err := http.NewRequest(tc.method, tc.url, nil)

		require.NoError(t, err)
		id := strconv.Itoa(tc.userID)
		stubAuthHeader := func(h http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				r.Header.Set("id", id)
				h.ServeHTTP(w, r)
			})
		}

		sql := sqlx.NewDb(db, "mysql")
		s := tradedb.NewStorage(sql)
		w := httptest.NewRecorder()
		server := &HTTPServer{board: s}
		handler := server.setupRouter(stubAuthHeader)

		handler.ServeHTTP(w, req)
		require.Equal(t, tc.expectedStatus, w.Code, name)
		println(strings.TrimSuffix(w.Body.String(), "\n"))
		require.Equal(t, tc.expectedBody, strings.TrimSuffix(w.Body.String(), "\n"), name)
	}
}
