package db

import (
	"time"

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

// AdvertMessagesInfo represents an information about the messages
type AdvertMessagesInfo struct {
	Author          string    `json:"author" db:"Author"`
	TotalMessages   int       `json:"totalMessages" db:"TotalMessages"`
	NewMessages     int       `json:"newMessages" db:"NewMessages"`
	LastMessage     string    `json:"lastMessage" db:"LastMessage"`
	LastMessageTime time.Time `json:"lastMessageTime" db:"LastMessageTime"`
}

// GetAdvertMessageAuthors returns usernames of all authors that wrote messages under specific advert
func (m Messages) GetAdvertMessageAuthors(advertID int64) ([]AdvertMessagesInfo, error) {
	res := []AdvertMessagesInfo{}
	cmd := `SELECT U.UserName AS Author, COUNT(*) AS TotalMessages, ` +

		`(SELECT COUNT(*) ` +
		`FROM Messages M2 ` +
		`INNER JOIN Adverts A ON A.Id = M2.AdvertId ` +
		`WHERE M2.AdvertId = ? AND M2.Author = U.Id AND M2.IsRead = 0 AND M2.Author <> A.Author) AS NewMessages, ` +

		`MAX(M.CreatedAt) AS LastMessageTime, ` +
		`(SELECT LM.Body ` +
		`FROM Messages LM ` +
		`WHERE LM.Id = (SELECT LM2.Id ` +
		`FROM Messages LM2 ` +
		`WHERE LM2.AdvertId = ? AND LM2.Author=U.Id ` +
		`ORDER BY LM2.CreatedAt DESC ` +
		`LIMIT 1)) AS LastMessage ` +

		`FROM Messages M ` +
		`INNER JOIN Users U ON U.Id = M.Author AND M.AdvertId = ? ` +
		`GROUP BY UserName ASC`

	if err := m.DB.Select(&res, cmd, advertID, advertID, advertID); err != nil {
		return nil, err
	}

	return res, nil
}

// Get tries to find a message by specified id. Returns error if message doesn't exist.
func (m Messages) Get(id int64) (*models.MessageDetails, error) {
	res := []models.MessageDetails{}
	cmd := `SELECT M.Id, ` +
		`UA.UserName AS Author, ` +
		`M.AdvertId, ` +
		`M.Body, ` +
		`M.CreatedAt, ` +
		`UR.UserName AS Recipient, ` +
		`M.IsRead ` +
		`FROM Messages M ` +
		`INNER JOIN Users UA ON M.Author=UA.Id ` +
		`LEFT JOIN Users UR ON M.Recipient=UR.Id ` +
		`WHERE M.Id = ?`

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
func (m Messages) GetAdvertMessagesByAuthor(advertID int64, username string) ([]models.MessageDetails, error) {
	res := []models.MessageDetails{}
	cmd := `SELECT M.Id, ` +
		`U.UserName AS Author, ` +
		`M.AdvertId, ` +
		`M.Body, ` +
		`M.CreatedAt, ` +
		`UR.UserName AS Recipient, ` +
		`M.IsRead ` +
		`FROM Messages M  ` +
		`INNER JOIN Users U ON U.Id = M.Author AND M.AdvertId = ? AND U.UserName = ? ` +
		`LEFT JOIN Users UR ON M.Recipient=UR.Id ` +

		`UNION ALL ` +

		`SELECT M.Id, ` +
		`UA.UserName AS Author, ` +
		`M.AdvertId,  ` +
		`M.Body, ` +
		`M.CreatedAt, ` +
		`U.UserName AS Recipient, ` +
		`M.IsRead ` +
		`FROM Messages M ` +
		`INNER JOIN Users U ON U.Id = M.Recipient AND M.AdvertId = ? AND U.UserName = ? ` +
		`INNER JOIN Users UA ON UA.Id = M.Author ` +
		`ORDER BY CreatedAt`

	err := m.DB.Select(&res, cmd, advertID, username, advertID, username)
	if err != nil {
		return nil, err
	}

	return res, nil
}
