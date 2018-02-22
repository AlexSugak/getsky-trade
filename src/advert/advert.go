package advert

import (
	"time"
)

type TradeOption int
type AdvertType int

const (
	CashInPerson TradeOption = iota + 1
	CashByMail
	MoneyOrderByMail
	Other

	Sell AdvertType = iota + 1
	Buy
)

// Advert represents an advert record
type Advert struct {
	ID           int
	Expires      time.Time
	TradeOptions []TradeOption
	Type         AdvertType
	Amount       uint64
	Location     string
	Seller       string
}
