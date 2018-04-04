package db

import (
	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/jmoiron/sqlx"
)

// Messages is a storage of messages
type Messages struct {
	DB *sqlx.DB
}

// NewMessages creates a new instance of the messages storage
func NewMessages(db *sqlx.DB) Messages {
	return Messages{db}
}

// SaveMessage saves specified message to the DB, returns created message or error
func (m Messages) SaveMessage(msg *models.Message) (*models.Message, error) {
	cmd := `INSERT INTO Messages ` +
		`(Author, ` +
		`AdvertId, ` +
		`Body, ` +
		`CreatedAt, ` +
		`Recipient, ` +
		`IsRead) ` +

		`VALUES( ` +
		`:Author, ` +
		`:AdvertId, ` +
		`:Body, ` +
		`:CreatedAt, ` +
		`:Recipient, ` +
		`:IsRead)`

	res, err := m.DB.NamedExec(cmd, msg)
	if err != nil {
		return nil, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	msg.ID = id
	return msg, nil
}

// UpdateMessage updates message record in the DB
func (m Messages) UpdateMessage(msg *models.Message) error {
	cmd := `UPDATE Messages ` +
		`SET IsRead=:IsRead ` +
		`WHERE Id=:Id`

	_, err := m.DB.NamedExec(cmd, msg)
	return err
}

// GetAdvertMessageAuthors returns usernames of all authors that wrote messages under specific advert
func (m Messages) GetAdvertMessageAuthors(advertID int64) ([]string, error) {
	res := []string{}
	cmd := `SELECT DISTINCT U.UserName as UserName ` +
		`FROM Messages M ` +
		`INNER JOIN Users U ON U.Id = M.Author AND M.AdvertId = ?
		 ORDER BY UserName`
	rows, err := m.DB.Query(cmd, advertID)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		r := new(string)
		err := rows.Scan(r)
		if err != nil {
			return nil, err
		}
		res = append(res, *r)
	}

	return res, nil
}

// Get tries to find a message by specified id. Returns error if message doesn't exist.
func (m Messages) Get(id int64) (*models.Message, error) {
	res := []models.Message{}
	cmd := `SELECT Id, ` +
		`Author, ` +
		`AdvertId, ` +
		`Body, ` +
		`CreatedAt, ` +
		`Recipient, ` +
		`IsRead ` +
		`FROM Messages ` +
		`WHERE Id = ?`

	err := m.DB.Select(&res, cmd, id)
	if err != nil {
		return nil, err
	}

	if len(res) > 0 {
		return &res[0], nil
	}

	return &res[0], nil
}

// GetAdvertMessagesByAuthor returns all messages of specified advert madden by specified author and all replies to this author
func (m Messages) GetAdvertMessagesByAuthor(advertID int64, username string) ([]models.Message, error) {
	res := []models.Message{}
	cmd := `SELECT M.Id, ` +
		`M.Author, ` +
		`M.AdvertId, ` +
		`M.Body, ` +
		`M.CreatedAt, ` +
		`M.Recipient, ` +
		`M.IsRead ` +
		`FROM Messages M  ` +
		`INNER JOIN Users U ON U.Id = M.Author AND M.AdvertId = ? AND U.UserName = ? ` +

		`UNION ALL ` +

		`SELECT M.Id, ` +
		`M.Author, ` +
		`M.AdvertId,  ` +
		`M.Body, ` +
		`M.CreatedAt, ` +
		`M.Recipient, ` +
		`M.IsRead ` +
		`FROM Messages M ` +
		`INNER JOIN Users U ON U.Id = M.Recipient AND M.AdvertId = ? AND U.UserName = ? ` +
		`ORDER BY CreatedAt`

	err := m.DB.Select(&res, cmd, advertID, username, advertID, username)
	if err != nil {
		return nil, err
	}

	return res, nil
}
