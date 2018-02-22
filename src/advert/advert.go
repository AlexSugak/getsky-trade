package advert

import (
	"time"
)

// TradeOption represents different types of trade options
type TradeOption int

// Type represents an Advert type (e.g. sell or buy)
type Type int

const (
	// CashInPerson trade option stands for cache exchange happening in person
	CashInPerson TradeOption = iota + 1
	// CashByMail trade option stands for cache exchange happening via mail
	CashByMail
	// MoneyOrderByMail trade option stands for cache exchange happening via money order sent by mail
	MoneyOrderByMail
	// Other unknown trade option
	Other

	// Sell advert type
	Sell Type = iota + 1
	// Buy advert type
	Buy
)

// Advert represents an advert record
type Advert struct {
	ID           int
	Expires      time.Time
	TradeOptions []TradeOption
	Type         Type
	Amount       uint64
	Location     string
	Seller       string
}
