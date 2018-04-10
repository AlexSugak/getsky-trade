package trade

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/AlexSugak/getsky-trade/src/board"
	ce "github.com/AlexSugak/getsky-trade/src/errors"
	"github.com/shopspring/decimal"
	validator "gopkg.in/go-playground/validator.v9"

	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	"github.com/jmoiron/sqlx/types"
)

// GetExtendedDate returns extended expiration date
func GetExtendedDate(current time.Time) time.Time {
	return current.AddDate(0, 0, 28)
}

// PostAdvertRequest represents a POST advert request model
type PostAdvertRequest struct {
	Author                string                 `json:"author" validate:"required"`
	TradeCashInPerson     types.BitBool          `json:"tradeCashInPerson"`
	TradeCashByMail       types.BitBool          `json:"tradeCashByMail"`
	TradeMoneyOrderByMail types.BitBool          `json:"tradeMoneyOrderByMail"`
	TradeOther            types.BitBool          `json:"tradeOther"`
	AmountFrom            decimal.Decimal        `json:"amountFrom" validate:"required"`
	AmountTo              models.JSONNullDecimal `json:"amountTo"`
	PercentageAdjustment  models.JSONNullDecimal `json:"percentageAdjustment"`
	FixedPrice            models.JSONNullDecimal `json:"fixedPrice"`
	Currency              string                 `json:"currency" validate:"required"`
	AdditionalInfo        string                 `json:"additionalInfo"`

	TravelDistance    int64  `json:"travelDistance" validate:"required"`
	TravelDistanceUoM string `json:"travelDistanceUoM"`

	CountryCode string                `json:"countryCode" validate:"required"`
	StateCode   models.JSONNullString `json:"stateCode"`
	City        string                `json:"city" validate:"required"`
	PostalCode  string                `json:"postalCode"`

	Recaptcha string `json:"recaptcha" validate:"required"`
}

func prepareAdvert(s *HTTPServer, w http.ResponseWriter, r *http.Request) (*models.Advert, error) {
	w.Header().Set("Accept", "application/json")

	body := &PostAdvertRequest{}
	if err := json.NewDecoder(r.Body).Decode(body); err != nil {
		return nil, httputil.StatusError{
			Err:  fmt.Errorf("Invalid json request body: %v", err),
			Code: http.StatusBadRequest,
		}
	}

	err := s.validate.Struct(body)
	if err != nil {
		return nil, ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
	}

	user, err := s.users.Get(body.Author)
	if err != nil {
		http.Error(w, fmt.Sprintf("the user with the userName: '%s' doesn't exist", body.Author), http.StatusNotFound)
		return nil, nil
	}

	res, err := s.checkRecaptcha(body.Recaptcha)
	if err != nil {
		return nil, err
	} else if !res {
		return nil, ce.CreateSingleValidationError("recaptcha", "is not valid")
	}

	currentTime := s.serverTime.Now()
	return &models.Advert{
		ID:                    0,
		Type:                  int(board.Buy),
		Author:                user.ID,
		TradeCashInPerson:     body.TradeCashInPerson,
		TradeCashByMail:       body.TradeCashByMail,
		TradeMoneyOrderByMail: body.TradeMoneyOrderByMail,
		TradeOther:            body.TradeOther,
		AmountFrom:            body.AmountFrom,
		AmountTo:              body.AmountTo,
		FixedPrice:            body.FixedPrice,
		PercentageAdjustment:  body.PercentageAdjustment,
		Currency:              body.Currency,
		AdditionalInfo:        body.AdditionalInfo,
		TravelDistance:        body.TravelDistance,
		TravelDistanceUoM:     body.TravelDistanceUoM,
		CountryCode:           body.CountryCode,
		StateCode:             body.StateCode,
		City:                  body.City,
		PostalCode:            body.PostalCode,
		Status:                1,
		CreatedAt:             currentTime,
		ExpiredAt:             GetExtendedDate(currentTime),
	}, nil
}

// BuyAdvertHandler saves received advert to the DB
// Method: GET
// Content-type: application/json
// URI: /api/postings/buy
func BuyAdvertHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		advert, err := prepareAdvert(s, w, r)
		if err != nil {
			return err
		}
		if advert == nil {
			return nil
		}
		advert.Type = int(board.Buy)

		entityID, err := s.board.InsertAdvert(advert)
		if err != nil {
			return err
		}

		insertedEntity, err := s.board.GetAdvertDetails(entityID)
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(&insertedEntity)
	}
}

// SellAdvertHandler saves received advert to the DB
// Method: GET
// Content-type: application/json
// URI: /api/postings/sell
func SellAdvertHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		advert, err := prepareAdvert(s, w, r)
		if err != nil {
			return err
		}
		if advert == nil {
			return nil
		}

		if !advert.PercentageAdjustment.NullDecimal.Valid && !advert.FixedPrice.NullDecimal.Valid {
			http.Error(w, fmt.Sprintf("percentageAdjustment or fixedPrice has to have a value"), http.StatusBadRequest)
			return nil
		}

		advert.Type = int(board.Sell)

		entityID, err := s.board.InsertAdvert(advert)
		if err != nil {
			return err
		}

		insertedEntity, err := s.board.GetAdvertDetails(entityID)
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(&insertedEntity)
	}
}
