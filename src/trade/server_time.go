package trade

import (
	"time"
)

// ServerTime respresents a wrapper of time module
type ServerTime interface {
	Now() time.Time
}

// ServerTimeImp respresents an implementation of the time module wrapper
type ServerTimeImp struct {
}

// Now returns the current local time
func (st ServerTimeImp) Now() time.Time {
	return time.Now()
}
