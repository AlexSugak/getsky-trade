package models

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"

	"github.com/shopspring/decimal"

	"github.com/jmoiron/sqlx/types"
)

// JSONNullDecimal wraps decimal.NullDecimal to provide JSON-friendly marshaling
type JSONNullDecimal struct {
	decimal.NullDecimal
}

// MarshalJSON converts JSONNullFloat64 value to json
func (v JSONNullDecimal) MarshalJSON() ([]byte, error) {
	if v.Valid {
		return json.Marshal(v.Decimal)
	}
	return json.Marshal(nil)
}

// UnmarshalJSON converts json value to JSONNullFloat64
func (v *JSONNullDecimal) UnmarshalJSON(data []byte) error {
	var x *decimal.Decimal
	if err := json.Unmarshal(data, &x); err != nil {
		return err
	}
	if x != nil {
		v.Valid = true
		v.Decimal = *x
	} else {
		v.Valid = false
	}
	return nil
}

// JSONNullString wraps sql.NullString to provide JSON-friendly marshaling
type JSONNullString struct {
	sql.NullString
}

// MarshalJSON converts JSONNullString value to json
func (v JSONNullString) MarshalJSON() ([]byte, error) {
	if v.Valid {
		return json.Marshal(v.String)
	}
	return json.Marshal(nil)
}

// UnmarshalJSON converts json value to JSONNullString
func (v *JSONNullString) UnmarshalJSON(data []byte) error {
	var x *string
	if err := json.Unmarshal(data, &x); err != nil {
		return err
	}
	if x != nil {
		v.Valid = true
		v.String = *x
	} else {
		v.Valid = false
	}
	return nil
}

// JSONNullInt64 wraps sql.JSONNullInt64 to provide JSON-friendly marshaling
type JSONNullInt64 struct {
	sql.NullInt64
}

// MarshalJSON converts JSONNullInt64 value to json
func (v JSONNullInt64) MarshalJSON() ([]byte, error) {
	if v.Valid {
		return json.Marshal(v.Int64)
	}
	return json.Marshal(nil)
}

// UnmarshalJSON converts json value to JSONNullInt64
func (v *JSONNullInt64) UnmarshalJSON(data []byte) error {
	var x *int64
	if err := json.Unmarshal(data, &x); err != nil {
		return err
	}
	if x != nil {
		v.Valid = true
		v.Int64 = *x
	} else {
		v.Valid = false
	}
	return nil
}

// NullBitBool is an implementation of a bool for the MySQL type BIT(1). This type also supports null value
// This type allows you to avoid wasting an entire byte for MySQL's boolean type TINYINT.
type NullBitBool struct {
	types.BitBool
	Valid bool // Valid is true if BitBool is not NULL
}

// Scan implements the Scanner interface.
func (n *NullBitBool) Scan(value interface{}) error {
	if value == nil {
		n.BitBool, n.Valid = false, false
		return nil
	}
	n.Valid = true
	return n.BitBool.Scan(value)
}

// Value implements the driver Valuer interface.
func (n NullBitBool) Value() (driver.Value, error) {
	if !n.Valid {
		return nil, nil
	}
	return n.BitBool.Value()
}
