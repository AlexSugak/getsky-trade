package user

import "github.com/AlexSugak/getsky-trade/db/models"

// Users serve as an interface to users storage
type Users interface {
	Get(string) (*models.UserDetails, error)
	GetByEmail(string) (*models.UserDetails, error)
	Register(models.User, string) error
	UpdateSettings(models.UserSettings) error
}
