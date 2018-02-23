package advert

import "github.com/AlexSugak/getsky-trade/db/models"

// Board represents adverts board interface
type Board interface {
	GetLatestAdverts() ([]*models.AdvertDetails, error)
}
