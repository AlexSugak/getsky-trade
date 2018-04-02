package db

import "github.com/jmoiron/sqlx"

// Messages is a messages storage
type Messages struct {
	DB *sqlx.DB
}

// NewMessages creates a new instance of the messages storage
func NewMessages(db *sqlx.DB) Messages {
	return Messages{db}
}
