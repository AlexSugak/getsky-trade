package geo

import (
	"github.com/AlexSugak/getsky-trade/db/models"
)

// Geo represents geolocation interface
type Geo interface {
	GetStates() ([]models.State, error)
	GetCountries() ([]models.Country, error)
}
