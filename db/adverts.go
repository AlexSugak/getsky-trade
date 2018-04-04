package db

import (
	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/AlexSugak/getsky-trade/src/board"
	"github.com/jmoiron/sqlx"
)

const advertsFields = ` a.Id,` +
	` a.Type,` +
	` a.TradeCashInPerson, ` +
	` a.TradeCashByMail,` +
	` a.TradeMoneyOrderByMail,` +
	` a.TradeOther,` +
	` a.AmountFrom,` +
	` a.AmountTo,` +
	` a.FixedPrice,` +
	` a.PercentageAdjustment,` +
	` a.Currency,` +
	` a.AdditionalInfo,` +
	` a.TravelDistance,` +
	` a.TravelDistanceUoM,` +
	` a.CountryCode,` +
	` a.StateCode,` +
	` a.City,` +
	` a.PostalCode,` +
	` a.Status,` +
	` a.CreatedAt`

// Storage stands for main DB storage
type Storage struct {
	DB *sqlx.DB
}

// NewStorage creates new Storage
func NewStorage(db *sqlx.DB) Storage {
	return Storage{db}
}

// GetAdvertsEnquiredByUser returns adverts that was enquired by the user
func (s Storage) GetAdvertsEnquiredByUser(userID int64) ([]models.AdvertDetails, error) {
	adverts := []models.AdvertDetails{}
	err := s.DB.Select(&adverts,
		`SELECT `+advertsFields+
			` FROM Adverts a `+
			` INNER JOIN Messages m ON a.Id = m.AdvertId`+
			` WHERE a.Author <> ?`, userID)

	if err != nil {
		return nil, err
	}

	return adverts, nil
}

// GetAdvertsWithMessageCountsByUserID returns adverts was enquired by the user
func (s Storage) GetAdvertsWithMessageCountsByUserID(userID int64) ([]models.AdvertsWithMessageCounts, error) {
	cmd := `SELECT ` + advertsFields + `, ` +
		` u.UserName as Author, ` +
		` m.IsRead as IsRead` +
		` FROM Adverts a` +
		` INNER JOIN Users u ON a.Author = u.Id` +
		` LEFT JOIN Messages m ON a.Id = m.AdvertId` +
		` WHERE a.Author = ? AND (m.Recipient = ? OR m.Recipient IS NULL)`

	rows, err := s.DB.Query(cmd, userID, userID)
	if err != nil {
		return nil, err
	}

	res := []models.AdvertsWithMessageCounts{}

	awmc := models.AdvertsWithMessageCounts{}
	newMessagesAmount := 0
	totalMessagesAmount := 0

	for rows.Next() {
		ad := models.AdvertDetails{}
		isRead := models.NullBitBool{}

		err = rows.Scan(&ad.ID,
			&ad.Type,
			&ad.TradeCashInPerson,
			&ad.TradeCashByMail,
			&ad.TradeMoneyOrderByMail,
			&ad.TradeOther,
			&ad.AmountFrom,
			&ad.AmountTo,
			&ad.FixedPrice,
			&ad.PercentageAdjustment,
			&ad.Currency,
			&ad.AdditionalInfo,
			&ad.TravelDistance,
			&ad.TravelDistanceUoM,
			&ad.CountryCode,
			&ad.StateCode,
			&ad.City,
			&ad.PostalCode,
			&ad.Status,
			&ad.CreatedAt,
			&ad.Author,
			&isRead)
		if err != nil {
			return nil, err
		}

		if awmc.AdvertDetails.ID == 0 {
			awmc.AdvertDetails = ad
		}

		if awmc.AdvertDetails.ID != ad.ID {
			awmc.AdvertDetails = ad
			awmc.NewMessagesAmount = newMessagesAmount
			awmc.TotalMessagesAmount = totalMessagesAmount
			res = append(res, awmc)

			newMessagesAmount = 0
			totalMessagesAmount = 0
		}

		totalMessagesAmount++
		if isRead.Valid && bool(isRead.BitBool) {
			newMessagesAmount++
		}
	}

	return res, nil
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

// InsertAdvert inserts a new advert record to the DB
func (s Storage) InsertAdvert(advert *models.Advert) (int64, error) {
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
