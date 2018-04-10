package trade

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/AlexSugak/getsky-trade/src/board"
	ce "github.com/AlexSugak/getsky-trade/src/errors"
	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx/types"
	"github.com/shopspring/decimal"
	validator "gopkg.in/go-playground/validator.v9"
)

// LatestSellAdvertsHandler returns 10 latest sell adverts
// Method: GET
// Content-type: application/json
// URI: /api/postings/sell/latest
func LatestSellAdvertsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		adverts, err := s.board.GetLatestAdverts(board.Sell, 10, s.serverTime.Now())
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(adverts)
	}
}

// LatestBuyAdvertsHandler returns 10 latest buy adverts
// Method: GET
// Content-type: application/json
// URI: /api/postings/buy/latest
func LatestBuyAdvertsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		adverts, err := s.board.GetLatestAdverts(board.Buy, 10, s.serverTime.Now())
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(adverts)
	}
}

// AdvertDetailsHandler returns advert deatails by its id
// Method: GET
// Content-type: application/json
// URI: /api/postings/{id}
func AdvertDetailsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)

		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		advert, err := s.board.GetAdvertDetails(advertID)

		if err != nil {
			return err
		} else if advert == (models.AdvertDetails{}) {
			http.Error(w, "advert with such id doesn't exist", http.StatusNotFound)
			return nil
		}

		return json.NewEncoder(w).Encode(advert)
	}
}

// DashboardAdvertsResponse represents adverts for user's dashboard
type DashboardAdvertsResponse struct {
	MyAdverts       []models.AdvertsWithMessageCounts         `json:"myAdverts"`
	EnquiredAdverts []models.EnquiredAdvertsWithMessageCounts `json:"enquiredAdverts"`
}

// MyAdvertsHandler returns list of user's adverts
// Method: GET
// Content-type: application/json
// URI: /api/postings/my
func MyAdvertsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		str := r.Header.Get("id")
		id, err := strconv.ParseInt(str, 10, 64)

		if err != nil {
			return err
		}

		userAdverts, err := s.board.GetAdvertsWithMessageCountsByUserID(id)
		if err != nil {
			return err
		}

		enquiredAdverts, err := s.board.GetAdvertsEnquiredByUserWithMessageCounts(id)
		if err != nil {
			return err
		}

		dashboardAdverts := DashboardAdvertsResponse{
			MyAdverts:       userAdverts,
			EnquiredAdverts: enquiredAdverts,
		}

		return json.NewEncoder(w).Encode(&dashboardAdverts)
	}
}

// DeleteAdvertHandler deletes specified advert
// Method: DELETE
// Content-type: application/json
// URI: /api/postings/{id}
func DeleteAdvertHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)

		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		advert, err := s.board.GetAdvertDetails(advertID)

		if err != nil {
			return err
		} else if advert == (models.AdvertDetails{}) {
			http.Error(w, "advert with such id doesn't exist", http.StatusNotFound)
			return nil
		}

		userName := r.Header.Get("name")
		if advert.Author != userName {
			http.Error(w, "You don't have rights to manage this resource", http.StatusForbidden)
			return nil
		}

		return s.board.DeleteAdvert(advertID)
	}
}

type updateAdvertRequest struct {
	TradeCashInPerson     types.BitBool `json:"tradeCashInPerson"`
	TradeCashByMail       types.BitBool `json:"tradeCashByMail"`
	TradeMoneyOrderByMail types.BitBool `json:"tradeMoneyOrderByMail"`
	TradeOther            types.BitBool `json:"tradeOther"`

	AmountFrom           decimal.Decimal        `json:"amountFrom" validate:"required"`
	AmountTo             models.JSONNullDecimal `json:"amountTo"`
	FixedPrice           models.JSONNullDecimal `json:"fixedPrice"`
	PercentageAdjustment models.JSONNullDecimal `json:"percentageAdjustment"`

	Currency          string `json:"currency" validate:"required"`
	AdditionalInfo    string `json:"additionalInfo"`
	TravelDistance    int64  `json:"travelDistance" validate:"required"`
	TravelDistanceUoM string `json:"travelDistanceUoM"`

	CountryCode string                `json:"countryCode" validate:"required"`
	StateCode   models.JSONNullString `json:"stateCode"`
	City        string                `json:"city" validate:"required"`
	PostalCode  string                `json:"postalCode"`
}

// UpdateAdvertHandler updates specified advert
// Method: PUT
// Content-type: application/json
// URI: /api/postings/{id}
func UpdateAdvertHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)
		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		body := &updateAdvertRequest{}
		if err = json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		if err = s.validate.Struct(body); err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		advert, err := s.board.GetAdvertDetails(advertID)
		if err != nil || (advert == models.AdvertDetails{}) {
			http.Error(w, "advert with specified id does not exist", http.StatusNotFound)
			return nil
		}

		if userName := r.Header.Get("name"); advert.Author != userName {
			http.Error(w, "You don't have rights to manage this resource", http.StatusForbidden)
			return nil
		}

		model := &models.Advert{
			ID:                    advertID,
			TradeCashInPerson:     body.TradeCashInPerson,
			TradeCashByMail:       body.TradeCashByMail,
			TradeMoneyOrderByMail: body.TradeMoneyOrderByMail,
			TradeOther:            body.TradeOther,

			AmountFrom:           body.AmountFrom,
			AmountTo:             body.AmountTo,
			FixedPrice:           body.FixedPrice,
			PercentageAdjustment: body.PercentageAdjustment,

			Currency:          body.Currency,
			AdditionalInfo:    body.AdditionalInfo,
			TravelDistance:    body.TravelDistance,
			TravelDistanceUoM: body.TravelDistanceUoM,

			CountryCode: body.CountryCode,
			StateCode:   body.StateCode,
			City:        body.City,
			PostalCode:  body.PostalCode,
		}

		return s.board.UpdateAdvert(model)
	}
}

// ExtendAdvertHandler extends expiration data of the specified advert
// Method: POST
// Content-type: application/json
// URI: /api/postings/{id}/extend
func ExtendAdvertHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)

		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		advert, err := s.board.GetAdvertDetails(advertID)

		if err != nil {
			return err
		} else if advert == (models.AdvertDetails{}) {
			http.Error(w, "advert with such id doesn't exist", http.StatusNotFound)
			return nil
		}

		userName := r.Header.Get("name")
		if advert.Author != userName {
			http.Error(w, "You don't have rights to manage this resource", http.StatusForbidden)
			return nil
		}

		nextExpirationDate := GetExtendedDate(advert.ExpiredAt)
		err = s.board.ExtendExperationTime(advert.ID, nextExpirationDate)

		if err != nil {
			return err
		}

		advert.ExpiredAt = nextExpirationDate
		return json.NewEncoder(w).Encode(advert)
	}
}
