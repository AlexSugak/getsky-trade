package board

import (
	"time"

	"github.com/AlexSugak/getsky-trade/db/models"
)

// AdvertType represents the type of advert
type AdvertType int

const (
	// Sell advert type
	Sell AdvertType = iota + 1
	// Buy advert type
	Buy
)

// Board represents adverts board interface
type Board interface {
	GetAdvertsEnquiredByUserWithMessageCounts(int64) ([]models.EnquiredAdvertsWithMessageCounts, error)
	GetAdvertsWithMessageCountsByUserID(int64) ([]models.AdvertsWithMessageCounts, error)
	GetLatestAdverts(AdvertType, int) ([]models.AdvertDetails, error)
	GetAdvertDetails(int64) (models.AdvertDetails, error)
	InsertAdvert(*models.Advert) (int64, error)
	ExtendExperationTime(int64, time.Time) error
	DeleteAdvert(advertID int64) error
}
