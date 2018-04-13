package trade

import (
	"encoding/json"
	"fmt"
	"net/http"

	ce "github.com/AlexSugak/getsky-trade/src/errors"
	"github.com/AlexSugak/getsky-trade/src/mail"
	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	validator "gopkg.in/go-playground/validator.v9"
)

type feedbackRequest struct {
	Email     string `json:"email" validate:"required"`
	Subject   string `json:"subject" validate:"required"`
	Name      string `json:"name" validate:"required"`
	Message   string `json:"message" validate:"required"`
	Recaptcha string `json:"recaptcha" validate:"required"`
}

// FeedbackHandler sends feedback form to the SMTP server
// Method: POST
// Content-type: application/json
// URI: /api/feedback
func FeedbackHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		body := &feedbackRequest{}
		if err := json.NewDecoder(r.Body).Decode(body); err != nil {
			return httputil.StatusError{
				Err:  fmt.Errorf("Invalid json request body: %v", err),
				Code: http.StatusBadRequest,
			}
		}

		if err := s.validate.Struct(body); err != nil {
			return ce.ValidatorErrorsResponse(err.(validator.ValidationErrors))
		}

		res, err := s.checkRecaptcha(body.Recaptcha)
		if err != nil {
			return err
		} else if !res {
			return ce.CreateSingleValidationError("recaptcha", "is not valid")
		}

		message := fmt.Sprintf("From %s (%s) \r\n%s", body.Name, body.Email, body.Message)

		err = s.mailer.SendFeedback(&mail.Letter{
			Subject: "Feedback from >> " + body.Subject,
			Body:    message,
		})
		return err
	}
}
