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
			` FROM Adverts a`+
			` LEFT JOIN Users u ON a.Author = u.Id`+
			` WHERE a.Type = ?`+
			` ORDER BY CreatedAt LIMIT ?`, t, limit)
	if err != nil {
		return nil, err
	}

	return adverts, nil
}

// GetAdvertDetails returns advert details by its ID
func (s Storage) GetAdvertDetails(advertID int64) (models.AdvertDetails, error) {
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
			` WHERE a.Id = ?`, advertID)

	if err != nil {
		return models.AdvertDetails{}, err
	}

	if len(adverts) > 0 {
		return adverts[0], nil
	}

	return models.AdvertDetails{}, nil
}

// InserAdvert inserts a new advert record to the DB
func (s Storage) InserAdvert(advert *models.AdvertEntity) (int64, error) {
	cmd := `INSERT INTO Adverts` +
		` (Type, ` +
		` Author, ` +
		` TradeCashInPerson, ` +
		` TradeCashByMail, ` +
		` TradeMoneyOrderByMail, ` +
		` TradeOther, ` +

		` AmountFrom, ` +
		` AmountTo, ` +
		` FixedPrice, ` +
		` PercentageAdjustment, ` +
		` Currency, ` +
		` AdditionalInfo, ` +

		` TravelDistance, ` +
		` TravelDistanceUoM, ` +
		` CountryCode, ` +
		` StateCode, ` +
		` City, ` +
		` PostalCode, ` +
		` Status, ` +
		` CreatedAt) ` +

		` VALUES ` +
		` (:Type, ` +
		` :Author, ` +
		` :TradeCashInPerson, ` +
		` :TradeCashByMail, ` +
		` :TradeMoneyOrderByMail, ` +
		` :TradeOther, ` +

		` :AmountFrom, ` +
		` :AmountTo, ` +
		` :FixedPrice, ` +
		` :PercentageAdjustment, ` +
		` :Currency, ` +
		` :AdditionalInfo, ` +

		` :TravelDistance, ` +
		` :TravelDistanceUoM, ` +
		` :CountryCode, ` +
		` :StateCode, ` +
		` :City, ` +
		` :PostalCode, ` +
		` :Status, ` +
		` :CreatedAt) `

	res, err := s.DB.NamedExec(cmd, advert)
	if err != nil {
		return 0, err
	}
	lastInsertID, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return lastInsertID, err
}
