package messages

import (
	"github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/db/models"
)

// Messages is a storage of messages
type Messages interface {
	SaveMessage(msg *models.Message) (*models.Message, error)
	UpdateMessage(msg *models.Message) error
	Get(id int64) (*models.MessageDetails, error)
	GetAdvertMessageAuthors(advertID int64) ([]db.AdvertMessagesInfo, error)
	GetAdvertMessagesByAuthor(advertID int64, username string) ([]models.MessageDetails, error)
}
