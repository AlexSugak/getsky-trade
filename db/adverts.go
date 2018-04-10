package db

import (
	"database/sql"
	"time"

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
	` a.CreatedAt, ` +
	` a.ExpiredAt`

// Storage stands for main DB storage
type Storage struct {
	DB *sqlx.DB
}

// NewStorage creates new Storage
func NewStorage(db *sqlx.DB) Storage {
	return Storage{db}
}

// GetAdvertsEnquiredByUserWithMessageCounts returns adverts that was enquired by the user and amount of related messages
func (s Storage) GetAdvertsEnquiredByUserWithMessageCounts(userID int64) ([]models.EnquiredAdvertsWithMessageCounts, error) {
	cmd := `SELECT ` + advertsFields + `, ` +
		` u.UserName as Author, ` +
		` m.Recipient, ` +
		` m.IsRead as IsRead` +
		` FROM Adverts a` +
		` INNER JOIN Users u ON a.Author = u.Id` +
		` INNER JOIN Messages m ON a.Id = m.AdvertId` +
		` WHERE (m.Author = ? OR m.Recipient = ?) AND a.Author <> ? AND a.IsDeleted = 0`

	rows, err := s.DB.Query(cmd, userID, userID, userID)
	if err != nil {
		return nil, err
	}

	res := []models.EnquiredAdvertsWithMessageCounts{}

	eawmc := models.EnquiredAdvertsWithMessageCounts{}
	newMessagesAmount := 0
	totalMessagesAmount := 0
	writtenBuyMessagesAmount := 0
	writtenSellMessagesAmount := 0
	ad := models.AdvertDetails{}

	for rows.Next() {
		isRead := models.NullBitBool{}
		recipient := sql.NullInt64{}

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
			&ad.ExpiredAt,
			&ad.Author,
			&recipient,
			&isRead)
		if err != nil {
			return nil, err
		}

		if eawmc.AdvertDetails.ID == 0 {
			eawmc.AdvertDetails = ad
		}

		if eawmc.AdvertDetails.ID != ad.ID {
			eawmc.NewMessagesAmount = newMessagesAmount
			eawmc.TotalMessagesAmount = totalMessagesAmount
			eawmc.WrittenBuyMessagesAmount = writtenBuyMessagesAmount
			eawmc.WrittenSellMessagesAmount = writtenSellMessagesAmount

			res = append(res, eawmc)

			eawmc.AdvertDetails = ad
			newMessagesAmount = 0
			totalMessagesAmount = 0
			writtenBuyMessagesAmount = 0
			writtenSellMessagesAmount = 0
		}

		if recipient.Valid && userID == recipient.Int64 {
			if isRead.Valid {
				totalMessagesAmount++
				if !bool(isRead.BitBool) {
					newMessagesAmount++
				}
			}
		} else {
			if ad.Type == int(board.Buy) {
				writtenBuyMessagesAmount++
			} else {
				writtenSellMessagesAmount++
			}
		}
	}

	if ad.ID != 0 {
		eawmc.AdvertDetails = ad
		eawmc.NewMessagesAmount = newMessagesAmount
		eawmc.TotalMessagesAmount = totalMessagesAmount
		eawmc.WrittenBuyMessagesAmount = writtenBuyMessagesAmount
		eawmc.WrittenSellMessagesAmount = writtenSellMessagesAmount
		res = append(res, eawmc)
	}

	return res, nil
}

// GetAdvertsWithMessageCountsByUserID returns adverts was enquired by the user
func (s Storage) GetAdvertsWithMessageCountsByUserID(userID int64) ([]models.AdvertsWithMessageCounts, error) {
	cmd := `SELECT ` + advertsFields + `, ` +
		` u.UserName as Author, ` +
		` m.IsRead as IsRead` +
		` FROM Adverts a` +
		` INNER JOIN Users u ON a.Author = u.Id` +
		` LEFT JOIN Messages m ON a.Id = m.AdvertId` +
		` WHERE a.Author = ? AND (m.Recipient = ? OR m.Recipient IS NULL) AND a.IsDeleted = 0`

	rows, err := s.DB.Query(cmd, userID, userID)
	if err != nil {
		return nil, err
	}

	res := []models.AdvertsWithMessageCounts{}

	awmc := models.AdvertsWithMessageCounts{}
	newMessagesAmount := 0
	totalMessagesAmount := 0
	ad := models.AdvertDetails{}

	for rows.Next() {
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
			&ad.ExpiredAt,
			&ad.Author,
			&isRead)
		if err != nil {
			return nil, err
		}

		if awmc.AdvertDetails.ID == 0 {
			awmc.AdvertDetails = ad
		}

		if awmc.AdvertDetails.ID != ad.ID {
			awmc.NewMessagesAmount = newMessagesAmount
			awmc.TotalMessagesAmount = totalMessagesAmount
			res = append(res, awmc)

			awmc.AdvertDetails = ad
			newMessagesAmount = 0
			totalMessagesAmount = 0
		}

		if isRead.Valid {
			totalMessagesAmount++
			if !bool(isRead.BitBool) {
				newMessagesAmount++
			}
		}
	}

	if ad.ID != 0 {
		awmc.AdvertDetails = ad
		awmc.NewMessagesAmount = newMessagesAmount
		awmc.TotalMessagesAmount = totalMessagesAmount
		res = append(res, awmc)
	}

	return res, nil
}

// GetLatestAdverts returns 10 latest adverts
func (s Storage) GetLatestAdverts(t board.AdvertType, limit int, time time.Time) ([]models.AdvertDetails, error) {
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
			` a.CreatedAt, `+
			` a.ExpiredAt`+
			` FROM Adverts a`+
			` LEFT JOIN Users u ON a.Author = u.Id`+
			` WHERE a.Type = ? AND a.ExpiredAt > ? AND a.IsDeleted = 0`+
			` ORDER BY CreatedAt LIMIT ?`, t, time, limit)
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
			` a.CreatedAt, `+
			` a.ExpiredAt`+
			` FROM getskytrade.Adverts a`+
			` LEFT JOIN getskytrade.Users u ON a.Author = u.Id`+
			` WHERE a.Id = ? AND a.IsDeleted = 0`, advertID)

	if err != nil {
		return models.AdvertDetails{}, err
	}

	if len(adverts) > 0 {
		return adverts[0], nil
	}

	return models.AdvertDetails{}, nil
}

// DeleteAdvert removes advert from the DB
func (s Storage) DeleteAdvert(advertID int64) error {
	cmd := `UPDATE Adverts SET IsDeleted = 1 WHERE Id = ?`
	_, err := s.DB.Exec(cmd, advertID)
	return err
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
		` CreatedAt, ` +
		` ExpiredAt)` +

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
		` :CreatedAt, ` +
		` :ExpiredAt)`

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

// ExtendExperationTime updates expiredAt of an advert
func (s Storage) ExtendExperationTime(ID int64, expirationDate time.Time) error {
	cmd := `UPDATE Adverts` +
		` SET ExpiredAt = ? ` +
		` WHERE Id = ?`

	_, err := s.DB.Exec(cmd, expirationDate, ID)

	return err
}
