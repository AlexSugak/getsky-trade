package trade

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/gorilla/mux"
	validator "gopkg.in/go-playground/validator.v9"

	ce "github.com/AlexSugak/getsky-trade/src/errors"
	"github.com/AlexSugak/getsky-trade/src/util/httputil"
)

type createMessageRequest struct {
	Body      string               `json:"body" validate:"required"`
	Recipient models.JSONNullInt64 `json:"recipient"`
}

// PostMessageHandler represents an API endpoint that saves received message
// Method: POST
// Content-type: application/json
// URI: /api/postings/{id}/messages
func PostMessageHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)
		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		body := &createMessageRequest{}
		if err = json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		if err = s.validate.Struct(body); err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		userName := r.Header.Get("name")
		u, err := s.users.Get(userName)
		if err != nil {
			http.Error(w, fmt.Sprintf("the user with the userName: '%s' doesn't exist", userName), http.StatusNotFound)
			return nil
		}

		message := &models.Message{
			AdvertID:  advertID,
			Author:    u.ID,
			Recipient: body.Recipient,
			Body:      body.Body,
			CreatedAt: s.serverTime.Now(),
			IsRead:    false,
		}
		message, err = s.messages.SaveMessage(message)
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(message)
	}
}

// GetMessageAuthorsHandler represents an API endpoint that returns usernames of the users
// that wrote messages under the specified advert
// Method: GET
// Content-type: application/json
// URI: /api/postings/{id}/messages-authors
func GetMessageAuthorsHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)
		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		advert, err := s.board.GetAdvertDetails(advertID)
		if err != nil {
			http.Error(w, fmt.Sprintf("the advert with the ID: '%d' doesn't exist", advertID), http.StatusNotFound)
			return nil
		}

		userName := r.Header.Get("name")
		if advert.Author != userName {
			http.Error(w, "You do not have rights to see this content", http.StatusForbidden)
			return nil
		}

		userNames, err := s.messages.GetAdvertMessageAuthors(advertID)
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(userNames)
	}
}

// GetMessagesHandler represents an API endpoint that returns messages of specified
// author and replies to him.
// Method: GET
// Content-type: application/json
// URI: /api/postings/{id}/messages/{authorName}
func GetMessagesHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		vars := mux.Vars(r)
		advertID, err := strconv.ParseInt(vars["id"], 10, 64)
		if err != nil {
			http.Error(w, "id is not valid. id should be a number", http.StatusBadRequest)
			return nil
		}

		advert, err := s.board.GetAdvertDetails(advertID)
		if err != nil {
			http.Error(w, fmt.Sprintf("the advert with the ID: '%d' doesn't exist", advertID), http.StatusNotFound)
			return nil
		}

		authorName := vars["authorName"]
		userName := r.Header.Get("name")
		if advert.Author != userName && authorName != userName {
			http.Error(w, "You do not have rights to see this content", http.StatusForbidden)
			return nil
		}

		messages, err := s.messages.GetAdvertMessagesByAuthor(advertID, authorName)
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(messages)
	}
}
