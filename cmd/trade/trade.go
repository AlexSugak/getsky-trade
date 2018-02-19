package main

import (
	"os"

	prefixed "github.com/gz-c/logrus-prefixed-formatter"
	"github.com/sirupsen/logrus"
	"github.com/skycoin/getsky-trade/src/trade"
)

func main() {
	log := initLogger()
	server := trade.NewHTTPServer(log)

	defer func() {
		err := server.Shutdown()
		if err != nil {
			panic(err.Error())
		}
	}()

	if err := server.Run(); err != nil {
		panic(err.Error())
	}
}

func initLogger() logrus.FieldLogger {
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
