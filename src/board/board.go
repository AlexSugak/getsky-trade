package board

import "github.com/AlexSugak/getsky-trade/db/models"

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
	GetAdvertsEnquiredByUser(int64) ([]models.AdvertDetails, error)
	GetAdvertsByUserID(int64) ([]models.AdvertDetails, error)
	GetLatestAdverts(AdvertType, int) ([]models.AdvertDetails, error)
	GetAdvertDetails(int64) (models.AdvertDetails, error)
	InsertAdvert(*models.Advert) (int64, error)
}
