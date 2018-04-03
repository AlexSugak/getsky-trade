package messages

import "github.com/AlexSugak/getsky-trade/db/models"

// Messages is a storage of messages
type Messages interface {
	SaveMessage(msg *models.Message) (*models.Message, error)
	GetAdvertMessageAuthors(advertID int64) ([]string, error)
	GetAdvertMessagesByAuthor(advertID int64, username string) ([]models.Message, error)
}
