package models

import (
	"database/sql"
	"encoding/json"
)

// JSONNullFloat64 wraps sql.NullFloat64 to provide JSON-friendly marshaling
type JSONNullFloat64 struct {
	sql.NullFloat64
}

// MarshalJSON converts JSONNullFloat64 value to json
func (v JSONNullFloat64) MarshalJSON() ([]byte, error) {
	if v.Valid {
		return json.Marshal(v.Float64)
	}
	return json.Marshal(nil)
}

// UnmarshalJSON converts json value to JSONNullFloat64
func (v *JSONNullFloat64) UnmarshalJSON(data []byte) error {
	var x *float64
	if err := json.Unmarshal(data, &x); err != nil {
		return err
	}
	if x != nil {
		v.Valid = true
		v.Float64 = *x
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
