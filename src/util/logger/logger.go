package logger

import (
	"os"

	prefixed "github.com/gz-c/logrus-prefixed-formatter"
	"github.com/sirupsen/logrus"
)

// InitLogger initialized new logger
func InitLogger() logrus.FieldLogger {
	log := logrus.New()
	log.Out = os.Stdout
	log.Formatter = &prefixed.TextFormatter{
		FullTimestamp:      true,
		AlwaysQuoteStrings: true,
		QuoteEmptyFields:   true,
		ForceFormatting:    true,
	}

	return log.WithField("prefix", "trade")
}
