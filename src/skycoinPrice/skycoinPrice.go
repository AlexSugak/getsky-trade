package skycoinPrice

import (
	"errors"
	"io/ioutil"
	"net/http"
	"time"
)

const refreshInterval = time.Minute * 5

var currencies = []string{"EUR", "USD"}

// SkycoinPrice represents a cached value of the skycoin price
type SkycoinPrice struct {
	apiResponse []byte
}

// NewSkycoinPrice creates a new instance of SkycoinPrice
func NewSkycoinPrice() *SkycoinPrice {
	return &SkycoinPrice{}
}

func getNewPrice(currency string) ([]byte, error) {
	resp, err := http.Get("https://api.coinmarketcap.com/v1/ticker/skycoin/?convert=" + currency)
	if err != nil {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

// SkycoinPrices represents a storage of all cached values of the Skycoin price
type SkycoinPrices struct {
	prices              map[string]*SkycoinPrice
	refreshCycleChannel chan string
}

// NewSkycoinPrices creates a new instance of the SkycoinPrices
func NewSkycoinPrices() *SkycoinPrices {
	return &SkycoinPrices{
		prices:              make(map[string]*SkycoinPrice),
		refreshCycleChannel: make(chan string, 1),
	}
}

// GetSkycoinPrice returns a skycon price
func (prices *SkycoinPrices) GetSkycoinPrice(currency string) ([]byte, error) {
	if val, exists := prices.prices[currency]; exists {
		return val.apiResponse, nil
	}
	return nil, errors.New("Specified currency doesn't exists")
}

func updatePrices(prices *SkycoinPrices, currencies []string) {
	for {
		for _, c := range currencies {
			resp, err := getNewPrice(c)
			if err != nil {
				continue
			}
			if v, exists := prices.prices[c]; exists {
				v.apiResponse = resp
			}
			prices.prices[c] = &SkycoinPrice{apiResponse: resp}
		}
		select {
		case _ = <-prices.refreshCycleChannel:
			break
		case <-time.After(refreshInterval):
			continue
		}
	}
}

// StartUpdatingCycle starts cycle that requests prices from the remote server
func (prices *SkycoinPrices) StartUpdatingCycle() {
	go updatePrices(prices, currencies)
}

// StopUpdatingCycle stops cycle
func (prices *SkycoinPrices) StopUpdatingCycle() {
	prices.refreshCycleChannel <- "STOP"
}
