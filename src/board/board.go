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
	GetLatestAdverts(AdvertType, int) ([]models.AdvertDetails, error)
	GetAdvertDetails(int64) (models.AdvertDetails, error)
	InserAdvert(*models.AdvertEntity) (int64, error)
}
