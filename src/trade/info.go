package trade

import (
	"encoding/json"
	"net/http"

	"github.com/AlexSugak/getsky-trade/src/util/httputil"
)

// APIInfoResponse holds basic API information
type APIInfoResponse struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Version     int    `json:"version"`
}

// APIInfoHandler returns api info
// Method: GET
// Content-type: application/json
// URI: /api
func APIInfoHandler(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		info := APIInfoResponse{
			Name:        "trade API",
			Description: "trade API provides endpoints to enable posting and searching Skycoin buy and sell adverts",
			Version:     1,
		}

		return json.NewEncoder(w).Encode(info)
	}
}
