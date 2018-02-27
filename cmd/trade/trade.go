package main

import (
	"flag"
	"os"

	"github.com/AlexSugak/getsky-trade/db"
	"github.com/AlexSugak/getsky-trade/src/trade"
	_ "github.com/go-sql-driver/mysql"
	prefixed "github.com/gz-c/logrus-prefixed-formatter"
	"github.com/knq/dburl"
	"github.com/sirupsen/logrus"
)

func main() {
	bindingFlag := flag.String("binding", "0.0.0.0:8081", "HTTP server binding")
	flag.Parse()

	log := initLogger()

	db, err := initDb()
	if err != nil {
		panic(err.Error())
	}

	server := trade.NewHTTPServer(*bindingFlag, *db, log)

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

func initDb() (*db.DB, error) {
	d, err := dburl.Open("mysql://root:root@localhost:3306/getskytrade?parseTime=true")
	if err != nil {
		return nil, err
	}

	return &db.DB{XO: d}, nil
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
