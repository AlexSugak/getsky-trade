package trade

import (
	"encoding/json"
	"net/http"

	"github.com/AlexSugak/getsky-trade/src/util/httputil"
)

// AvailableCountriesHandler returns available countries
// Method: GET
// Content-type: application/json
// URI: /api/countries
func AvailableCountriesHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		countries, err := s.geo.GetCountries()
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(countries)
	}
}

// AvailableStatesHandler returns available states
// Method: GET
// Content-type: application/json
// URI: /api/states
func AvailableStatesHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		states, err := s.geo.GetStates()
		if err != nil {
			return err
		}

		return json.NewEncoder(w).Encode(states)
	}
}
