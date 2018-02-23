package db

import "github.com/AlexSugak/getsky-trade/db/models"

// DB stands for main DB
type DB struct {
	XO models.XODB
}

// GetLatestAdverts returns 10 latest adverts
func (db *DB) GetLatestAdverts() ([]*models.AdvertDetails, error) {
	return models.GetAdvertDetails(db.XO)
}
