package models

import (
	"time"

	"github.com/jmoiron/sqlx/types"
)

// User represents a registered user account record
type User struct {
	ID            int64          `db:"Id"`
	UserName      string         `db:"UserName"`
	Email         string         `db:"Email"`
	PasswordHash  string         `db:"PasswordHash"`
	TimeOffset    int            `db:"TimeOffset"`
	CountryCode   JSONNullString `db:"CountryCode"`
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
	TimeOffset    int            `db:"TimeOffset" json:"timeOffset"`
	CountryCode   JSONNullString `db:"CountryCode" json:"countryCode"`
	StateCode     JSONNullString `db:"StateCode" json:"stateCode"`
	City          string         `db:"City" json:"city"`
	PostalCode    string         `db:"PostalCode" json:"postalCode"`
	DistanceUnits string         `db:"DistanceUnits" json:"distanceUnits"`
	Currency      string         `db:"Currency" json:"currency"`
	Status        int            `db:"Status" json:"status"`
	RegisteredAt  time.Time      `db:"RegisteredAt" json:"registeredAt"`
}

// UserSettings represents a user's settings that can be updated
type UserSettings struct {
	UserName      string         `db:"UserName" json:"username"`
	Email         string         `db:"Email" json:"email"`
	TimeOffset    int            `db:"TimeOffset" json:"timeOffset"`
	CountryCode   JSONNullString `db:"CountryCode" json:"countryCode"`
	StateCode     JSONNullString `db:"StateCode" json:"stateCode"`
	City          string         `db:"City" json:"city"`
	PostalCode    string         `db:"PostalCode" json:"postalCode"`
	DistanceUnits string         `db:"DistanceUnits" json:"distanceUnits"`
	Currency      string         `db:"Currency" json:"currency"`
}

// Country represents a country
type Country struct {
	Name string `db:"Name" json:"name"`
	Code string `db:"Code" json:"code"`
}

// State represents a country
type State struct {
	Name string `db:"Name" json:"name"`
	Code string `db:"Code" json:"code"`
}

// Message represents a message DB entity
type Message struct {
	ID        int64         `db:"Id" json:"id"`
	Author    int64         `db:"Author" json:"author"`
	AdvertID  int64         `db:"AdvertId" json:"advertId"`
	Body      string        `db:"Body" json:"body"`
	IsRead    types.BitBool `db:"IsRead" json:"isRead"`
	CreatedAt time.Time     `db:"CreatedAt" json:"createdAt"`
	Recipient JSONNullInt64 `db:"Recipient" json:"recipient"`
}

// MessageDetails represents message short details information
type MessageDetails struct {
	ID        int64          `db:"Id" json:"id"`
	Author    string         `db:"Author" json:"author"`
	AdvertID  int64          `db:"AdvertId" json:"advertId"`
	Body      string         `db:"Body" json:"body"`
	IsRead    types.BitBool  `db:"IsRead" json:"isRead"`
	CreatedAt time.Time      `db:"CreatedAt" json:"createdAt"`
	Recipient JSONNullString `db:"Recipient" json:"recipient"`
}
