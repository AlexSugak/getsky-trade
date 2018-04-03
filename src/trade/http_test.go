package trade

import (
	"database/sql"
	"fmt"
	"os"
	"testing"

	"github.com/mattes/migrate"
	"github.com/mattes/migrate/database/mysql"
	_ "github.com/mattes/migrate/source/file"
)

const dbName = "getskytrade"

var db *sql.DB

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func TestMain(m *testing.M) {
	// user fallback to local mysql in docker, ENV VARs for testing on Travis
	user := getEnv("MYSQL_USER", "root")
	password := getEnv("MYSQL_PASSWORD", "root")
	host := getEnv("MYSQL_HOST", "0.0.0.0:3306")
	constr := fmt.Sprintf("%s:%s@(%s)/%s?parseTime=true&multiStatements=true", user, password, host, dbName)
	db = initDb(constr)
	ensureTables()
	clearTables()
	code := m.Run()

	os.Exit(code)
}

func initDb(constr string) *sql.DB {
	d, err := sql.Open("mysql", constr)
	if err != nil {
		panic(err.Error())
	}
	return d
}

func execSQL(cmd string, args ...interface{}) {
	c := fmt.Sprintf(cmd, args...)
	_, err := db.Exec(c)
	if err != nil {
		panic(err.Error())
	}
}

func insertSQL(cmd string) int64 {
	res, err := db.Exec(cmd)
	if err != nil {
		panic(err.Error())
	}

	id, err := res.LastInsertId()
	if err != nil {
		panic(err.Error())
	}

	return id
}

func ensureTables() {
	fmt.Println("creating schema")

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		panic(err.Error())
	}
	m, err := migrate.NewWithDatabaseInstance("file://../../db/schema", "mysql", driver)
	if err != nil {
		panic(err.Error())
	}
	err = m.Up()
	fmt.Println(err) // TODO: why migrate returns err if no change in schema?
}

func clearTables() {
	fmt.Println("clearing tables")
	execSQL("DELETE FROM `%s`.`Messages`;", dbName)
	execSQL("DELETE FROM `%s`.`Adverts`;", dbName)
	execSQL("DELETE FROM `%s`.`Users`;", dbName)
	execSQL("ALTER TABLE `%s`.`Messages` AUTO_INCREMENT = 1;", dbName)
	execSQL("ALTER TABLE `%s`.`Adverts` AUTO_INCREMENT = 1;", dbName)
	execSQL("ALTER TABLE `%s`.`Users` AUTO_INCREMENT = 1;", dbName)
}
