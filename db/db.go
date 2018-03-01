package db

import (
	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/AlexSugak/getsky-trade/src/board"
	"github.com/jmoiron/sqlx"
)

// Storage stands for main DB storage
type Storage struct {
	DB *sqlx.DB
}

// NewStorage creates new Storage
func NewStorage(db *sqlx.DB) Storage {
	return Storage{db}
}

// GetLatestAdverts returns 10 latest adverts
func (s Storage) GetLatestAdverts(t board.AdvertType, limit int) ([]models.AdvertDetails, error) {
	adverts := []models.AdvertDetails{}
	err := s.DB.Select(&adverts,
		`SELECT `+
			` a.Id,`+
			` a.Type,`+
			` u.UserName as Author,`+
			` a.TradeCashInPerson, `+
			` a.TradeCashByMail,`+
			` a.TradeMoneyOrderByMail,`+
			` a.TradeOther,`+
			` a.AmountFrom,`+
			` a.AmountTo,`+
			` a.FixedPrice,`+
			` a.PercentageAdjustment,`+
			` a.Currency,`+
			` a.AdditionalInfo,`+
			` a.TravelDistance,`+
			` a.TravelDistanceUoM,`+
			` a.CountryCode,`+
			` a.StateCode,`+
			` a.City,`+
			` a.PostalCode,`+
			` a.Status,`+
			` a.CreatedAt`+
			` FROM getskytrade.Adverts a`+
			` LEFT JOIN getskytrade.Users u ON a.Author = u.Id`+
			` WHERE a.Type = ?`+
			` ORDER BY CreatedAt LIMIT ?`, t, limit)
	if err != nil {
		return nil, err
	}

	return adverts, nil
}

// Authenticator implements Auth interface using data stored in MySql DB
type Authenticator struct {
	DB *sqlx.DB
}

// NewAuthenticator creates new Authenticator
func NewAuthenticator(db *sqlx.DB) Authenticator {
	return Authenticator{db}
}

// VerifyPassword tryes to locate user in DB and check password against the hash stored in DB
func (da Authenticator) VerifyPassword(string, string) (bool, error) {
	return false, nil
}
