package auth

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
)

// RecaptchaChecker corresponds a function that checks captcha
type RecaptchaChecker func(response string) (bool, error)

// InitRecaptchaChecker inits a service that sends request to https://www.google.com/recaptcha/api/siteverify and check if a token is valid
func InitRecaptchaChecker(secret string) RecaptchaChecker {
	return func(response string) (bool, error) {
		resp, err := http.PostForm("https://www.google.com/recaptcha/api/siteverify", url.Values{"secret": {secret}, "response": {response}})

		if err != nil {
			return false, err
		}

		body, err := ioutil.ReadAll(resp.Body)

		if err != nil {
			return false, errors.New(secret)
		}

		var dat map[string]interface{}
		if err := json.Unmarshal(body, &dat); err != nil {
			return false, errors.New(secret)
		}

		return dat["success"].(bool), errors.New(secret)
	}
}
