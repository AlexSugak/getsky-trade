package trade

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/AlexSugak/getsky-trade/src/auth"
	ce "github.com/AlexSugak/getsky-trade/src/errors"
	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	"github.com/go-sql-driver/mysql"
	validator "gopkg.in/go-playground/validator.v9"
)

// AuthenticateRequest holds auth data
type AuthenticateRequest struct {
	UserName string `json:"username"`
	Password string `json:"password"`
}

// AuthenticateResponse holds generated token response
type AuthenticateResponse struct {
	Token string `json:"token"`
}

// AuthenticateHandler handles user authentication
// Method: POST
// Accept: application/json
// URI: /api/users/authenticate
// Args:
//    {"username": "...", "password": "..."}
func AuthenticateHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {

		w.Header().Set("Accept", "application/json")

		req := AuthenticateRequest{}
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&req); err != nil {
			err = fmt.Errorf("Invalid json request body: %v", err)
			return httputil.StatusError{
				Err:  err,
				Code: http.StatusBadRequest,
			}
		}

		err := s.authenticator.VerifyPassword(req.UserName, req.Password)
		if err != nil {
			return httputil.StatusError{
				Err:  errors.New("invalid username of password"),
				Code: http.StatusUnauthorized,
			}
		}

		token, err := auth.GetToken(req.UserName)
		if err != nil {
			return err
		}

		resp := AuthenticateResponse{
			Token: token,
		}

		return json.NewEncoder(w).Encode(resp)
	}
}

// RegisterRequest holds auth data
type RegisterRequest struct {
	UserName string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Timezone string `json:"timezone" validate:"required"`
}

// RegisterHandler handles user authentication
// Method: POST
// Accept: application/json
// URI: /api/users
func RegisterHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {

		w.Header().Set("Accept", "application/json")

		req := RegisterRequest{}
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&req); err != nil {
			err = fmt.Errorf("Invalid json request body: %v", err)
			return httputil.StatusError{
				Err:  err,
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(req)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		user := models.User{
			UserName: req.UserName,
			Email:    req.Email,
			Timezone: req.Timezone,
		}

		err = s.users.Register(user, req.Password)
		if err != nil {
			me, _ := err.(*mysql.MySQLError)
			if me.Number == ce.DbDuplicateEntry {
				return ce.DatabaseErrorResponse(err)
			}

			return httputil.StatusError{
				Err:  err,
				Code: http.StatusInternalServerError,
			}

		}

		return nil
	}
}

// UpdateSettingsRequest holds userDetails properties that should be updated
type UpdateSettingsRequest struct {
	UserName      string                `json:"username" validate:"required"`
	Timezone      string                `json:"timezone" validate:"required"`
	CountryCode   models.JSONNullString `json:"countryCode"`
	StateCode     models.JSONNullString `json:"stateCode"`
	City          string                `json:"city" validate:"required"`
	PostalCode    string                `json:"postalCode" validate:"required"`
	DistanceUnits string                `json:"distanceUnits" validate:"required"`
	Currency      string                `json:"currency" validate:"required"`
}

// UpdateUserSettingsHandler updates user's settings
// Method: POST
// Accept: application/json
// URI: /api/me/settings
func UpdateUserSettingsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		w.Header().Set("Accept", "application/json")

		req := UpdateSettingsRequest{}
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&req); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		err := s.validate.Struct(req)
		if err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		_, err = s.users.Get(req.UserName)
		if err != nil {
			http.Error(w, fmt.Sprintf("the user with the userName: '%s' doesn't exist", req.UserName), http.StatusNotFound)
			return nil
		}

		userSettings := models.UserSettings{
			UserName:      req.UserName,
			Timezone:      req.Timezone,
			CountryCode:   req.CountryCode,
			StateCode:     req.StateCode,
			City:          req.City,
			PostalCode:    req.PostalCode,
			DistanceUnits: req.DistanceUnits,
			Currency:      req.Currency,
		}

		err = s.users.UpdateSettings(userSettings)
		return err
	}
}

// MeResponse holds basic logged in user intofation
type MeResponse struct {
	UserName string `json:"username"`
}

// MeHandler returns currently logged in user info
// Method: GET
// Content-type: application/json
// URI: /api/me
func MeHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		info := MeResponse{
			UserName: "todo",
		}

		return json.NewEncoder(w).Encode(info)
	}
}
