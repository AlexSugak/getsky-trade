package db

import (
	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/jmoiron/sqlx"
)

// Geo implements Geo interface using data stored in MySql DB
type Geo struct {
	DB *sqlx.DB
}

// NewGeo creates new Geo service
func NewGeo(db *sqlx.DB) Geo {
	return Geo{db}
}

// GetCountries returns all available countries
func (s Geo) GetCountries() ([]models.Country, error) {
	countries := []models.Country{}
	err := s.DB.Select(&countries, "SELECT * FROM Countries")
	return countries, err
}

// GetStates returns all available countries
func (s Geo) GetStates() ([]models.State, error) {
	states := []models.State{}
	err := s.DB.Select(&states, "SELECT * FROM States")
	return states, err
}
