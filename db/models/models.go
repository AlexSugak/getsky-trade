package models

import (
	"time"

	"github.com/jmoiron/sqlx/types"
)

// AdvertDetails represents Advert short details information
type AdvertDetails struct {
	ID                    int64           `db:"Id" json:"id"`
	Type                  int             `db:"Type" json:"type"`
	Author                string          `db:"Author" json:"author"`
	TradeCashInPerson     types.BitBool   `db:"TradeCashInPerson" json:"tradeCashInPerson"`
	TradeCashByMail       types.BitBool   `db:"TradeCashByMail" json:"tradeCashByMail"`
	TradeMoneyOrderByMail types.BitBool   `db:"TradeMoneyOrderByMail" json:"tradeMoneyOrderByMail"`
	TradeOther            types.BitBool   `db:"TradeOther" json:"tradeOther"`
	AmountFrom            float64         `db:"AmountFrom" json:"amountFrom"`
	AmountTo              JSONNullFloat64 `db:"AmountTo" json:"amountTo"`
	FixedPrice            JSONNullFloat64 `db:"FixedPrice" json:"fixedPrice"`
	PercentageAdjustment  JSONNullFloat64 `db:"PercentageAdjustment" json:"percentageAdjustment"`
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
}

// User represents a registered user account record
type User struct {
	ID            int64          `db:"Id"`
	UserName      string         `db:"UserName"`
	Email         string         `db:"Email"`
	PasswordHash  string         `db:"PasswordHash"`
	Timezone      string         `db:"Timezone"`
	CountryCode   string         `db:"CountryCode"`
	StateCode     JSONNullString `db:"StateCode"`
	City          string         `db:"City"`
	PostalCode    string         `db:"PostalCode"`
	DistanceUnits string         `db:"DistanceUnits"`
	Currency      string         `db:"Currency"`
	Status        int            `db:"Status"`
	RegisteredAt  time.Time      `db:"RegisteredAt"`
}

// UserDetails represents a user information that can be read by client
type UserDetails struct {
	ID            int64          `db:"Id" json:"id"`
	UserName      string         `db:"UserName" json:"username"`
	Email         string         `db:"Email" json:"email"`
	Timezone      string         `db:"Timezone" json:"timezone"`
	CountryCode   string         `db:"CountryCode" json:"countryCode"`
	StateCode     JSONNullString `db:"StateCode" json:"stateCode"`
	City          string         `db:"City" json:"city"`
	PostalCode    string         `db:"PostalCode" json:"postalCode"`
	DistanceUnits string         `db:"DistanceUnits" json:"distanceUnits"`
	Currency      string         `db:"Currency" json:"currency"`
	Status        int            `db:"Status" json:"status"`
	RegisteredAt  time.Time      `db:"RegisteredAt" json:"registeredAt"`
}
