package models

import (
	"time"

	"github.com/jmoiron/sqlx/types"
	"github.com/shopspring/decimal"
)

// AdvertsWithMessageCounts represents advert detail with amount of sent messages
type AdvertsWithMessageCounts struct {
	AdvertDetails       AdvertDetails `json:"advert"`
	NewMessagesAmount   int           `json:"newMessagesAmount"`
	TotalMessagesAmount int           `json:"totalMessagesAmount"`
}

// EnquiredAdvertsWithMessageCounts represents advert detail with amount of sent and received messages
type EnquiredAdvertsWithMessageCounts struct {
	AdvertDetails             AdvertDetails `json:"advert"`
	NewMessagesAmount         int           `json:"newMessagesAmount"`
	TotalMessagesAmount       int           `json:"totalMessagesAmount"`
	WrittenSellMessagesAmount int           `json:"writtenSellMessagesAmount"`
	WrittenBuyMessagesAmount  int           `json:"writtenBuyMessagesAmount"`
}

// AdvertDetails represents Advert short details information
type AdvertDetails struct {
	ID                    int64           `db:"Id" json:"id"`
	Type                  int             `db:"Type" json:"type"`
	Author                string          `db:"Author" json:"author"`
	TradeCashInPerson     types.BitBool   `db:"TradeCashInPerson" json:"tradeCashInPerson"`
	TradeCashByMail       types.BitBool   `db:"TradeCashByMail" json:"tradeCashByMail"`
	TradeMoneyOrderByMail types.BitBool   `db:"TradeMoneyOrderByMail" json:"tradeMoneyOrderByMail"`
	TradeOther            types.BitBool   `db:"TradeOther" json:"tradeOther"`
	AmountFrom            decimal.Decimal `db:"AmountFrom" json:"amountFrom"`
	AmountTo              JSONNullDecimal `db:"AmountTo" json:"amountTo"`
	FixedPrice            JSONNullDecimal `db:"FixedPrice" json:"fixedPrice"`
	PercentageAdjustment  JSONNullDecimal `db:"PercentageAdjustment" json:"percentageAdjustment"`
	Currency              string          `db:"Currency" json:"currency"`
	AdditionalInfo        string          `db:"AdditionalInfo" json:"additionalInfo"`
	TravelDistance        int64           `db:"TravelDistance" json:"travelDistance"`
	TravelDistanceUoM     string          `db:"TravelDistanceUoM" json:"travelDistanceUoM"`
	CountryCode           string          `db:"CountryCode" json:"countryCode"`
	StateCode             JSONNullString  `db:"StateCode" json:"stateCode"`
	City                  string          `db:"City" json:"city"`
	PostalCode            string          `db:"PostalCode" json:"postalCode"`
	Status                int             `db:"Status" json:"status"`
	CreatedAt             time.Time       `db:"CreatedAt" json:"createdAt"`
	ExpiredAt             time.Time       `db:"ExpiredAt" json:"expiredAt"`
}

// Advert represents Advert DB entity
type Advert struct {
	ID                    int64           `db:"Id" json:"id"`
	Type                  int             `db:"Type" json:"type"`
	Author                int64           `db:"Author" json:"author"`
	TradeCashInPerson     types.BitBool   `db:"TradeCashInPerson" json:"tradeCashInPerson"`
	TradeCashByMail       types.BitBool   `db:"TradeCashByMail" json:"tradeCashByMail"`
	TradeMoneyOrderByMail types.BitBool   `db:"TradeMoneyOrderByMail" json:"tradeMoneyOrderByMail"`
	TradeOther            types.BitBool   `db:"TradeOther" json:"tradeOther"`
	AmountFrom            decimal.Decimal `db:"AmountFrom" json:"amountFrom"`
	AmountTo              JSONNullDecimal `db:"AmountTo" json:"amountTo"`
	FixedPrice            JSONNullDecimal `db:"FixedPrice" json:"fixedPrice"`
	PercentageAdjustment  JSONNullDecimal `db:"PercentageAdjustment" json:"percentageAdjustment"`
	Currency              string          `db:"Currency" json:"currency"`
	AdditionalInfo        string          `db:"AdditionalInfo" json:"additionalInfo"`
	TravelDistance        int64           `db:"TravelDistance" json:"travelDistance"`
	TravelDistanceUoM     string          `db:"TravelDistanceUoM" json:"travelDistanceUoM"`
	CountryCode           string          `db:"CountryCode" json:"countryCode"`
	StateCode             JSONNullString  `db:"StateCode" json:"stateCode"`
	City                  string          `db:"City" json:"city"`
	PostalCode            string          `db:"PostalCode" json:"postalCode"`
	Status                int             `db:"Status" json:"status"`
	CreatedAt             time.Time       `db:"CreatedAt" json:"createdAt"`
	ExpiredAt             time.Time       `db:"ExpiredAt" json:"expiredAt"`
}
