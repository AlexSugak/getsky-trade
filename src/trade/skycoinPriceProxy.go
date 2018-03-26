package trade

import (
	"net/http"

	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	"github.com/gorilla/mux"
)

// GetSkycoinPrice returns Skycoin price based on information, received from coinmarketcap.com.
// Method: GET
// Content-type: application/json
// URI: /api/skycoin-price/{currency}
func GetSkycoinPrice(s *HTTPServer) httputil.APIHandler {
	return func(w http.ResponseWriter, r *http.Request) error {
		currency := mux.Vars(r)["currency"]
		response, err := s.skycoinPrices.GetSkycoinPrice(currency)
		if err != nil {
			return err
		}
		_, err = w.Write(response)
		return err
	}
}
