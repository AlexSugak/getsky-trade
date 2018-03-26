package trade

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/AlexSugak/getsky-trade/src/board"
	ce "github.com/AlexSugak/getsky-trade/src/errors"
	validator "gopkg.in/go-playground/validator.v9"

	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	"github.com/jmoiron/sqlx/types"
)

// PostAdvertRequest represents a POST advert request model
type PostAdvertRequest struct {
	Author                string                 `json:"author" validate:"required"`
	TradeCashInPerson     types.BitBool          `json:"tradeCashInPerson"`
	TradeCashByMail       types.BitBool          `json:"tradeCashByMail"`
	TradeMoneyOrderByMail types.BitBool          `json:"tradeMoneyOrderByMail"`
	TradeOther            types.BitBool          `json:"tradeOther"`
	AmountFrom            float64                `json:"amountFrom" validate:"required"`
	AmountTo              models.JSONNullFloat64 `json:"amountTo"`
	PercentageAdjustment  float64                `json:"percentageAdjustment"`
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

// BuyAdvertHandler saves received advert to the DB
// Method: GET
// Content-type: application/json
// URI: /api/postings/buy
func BuyAdvertHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		w.Header().Set("Accept", "application/json")

		body := &PostAdvertRequest{}
		if err := json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(body)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		user, err := s.users.Get(body.Author)
		if err != nil {
			http.Error(w, fmt.Sprintf("the user with the userName: '%s' doesn't exist", body.Author), http.StatusNotFound)
			return nil
		}

		res, err := s.checkRecaptcha(body.Recaptcha)
		if err != nil {
			return err
		} else if !res {
			return ce.CreateSingleValidationError("recaptcha", "is not valid")
		}

		advert := models.AdvertEntity{
			ID:                    0,
			Type:                  int(board.Buy),
			Author:                user.ID,
			TradeCashInPerson:     body.TradeCashInPerson,
			TradeCashByMail:       body.TradeCashByMail,
			TradeMoneyOrderByMail: body.TradeMoneyOrderByMail,
			TradeOther:            body.TradeOther,
			AmountFrom:            body.AmountFrom,
			AmountTo:              body.AmountTo,
			FixedPrice:            models.JSONNullFloat64{},
			PercentageAdjustment:  models.JSONNullFloat64{},
			Currency:              body.Currency,
			AdditionalInfo:        body.AdditionalInfo,
			TravelDistance:        body.TravelDistance,
			TravelDistanceUoM:     body.TravelDistanceUoM,
			CountryCode:           body.CountryCode,
			StateCode:             body.StateCode,
			City:                  body.City,
			PostalCode:            body.PostalCode,
			Status:                1,
			CreatedAt:             s.serverTime.Now(),
		}

		_, err = w.Write([]byte(``))
		if err != nil {
			return err
		}

		entityID, err := s.board.InserAdvert(&advert)
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
