package db

import (
	"fmt"

	"github.com/AlexSugak/getsky-trade/db/models"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

// Authenticator implements Auth interface using data stored in MySql DB
type Authenticator struct {
	DB *sqlx.DB
}

// NewAuthenticator creates new Authenticator
func NewAuthenticator(db *sqlx.DB) Authenticator {
	return Authenticator{db}
}

// VerifyPassword tries to locate user in DB and check password against the hash stored in DB
func (da Authenticator) VerifyPassword(userName string, password string) error {
	user := models.User{}
	err := da.DB.Get(&user, "SELECT * FROM Users u WHERE u.UserName = ?", userName)

	if err != nil {
		return fmt.Errorf("User not found, %s", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	return err
}

// Users implement Users interface by using DB
type Users struct {
	DB *sqlx.DB
}

// NewUsers initializes new Users instance
func NewUsers(db *sqlx.DB) Users {
	return Users{db}
}

// Get tries to find a user record in DB by userName and returns error if not found
func (u Users) Get(userName string) (*models.UserDetails, error) {
	user := models.UserDetails{}
	err := u.DB.Get(&user, "SELECT Id, UserName, Email, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status, RegisteredAt FROM Users u WHERE u.UserName = ?", userName)

	return &user, err
}

// GetByEmail tries to find a user record in DB by email and returns error if not found
func (u Users) GetByEmail(email string) (*models.UserDetails, error) {
	user := models.UserDetails{}
	err := u.DB.Get(&user, "SELECT Id, UserName, Email, TimeOffset, CountryCode, StateCode, City, PostalCode, DistanceUnits, Currency, Status, RegisteredAt FROM Users u WHERE u.Email = ?", email)

	return &user, err
}

// Register inserts new user record in DB and returns error if failed to do so
func (u Users) Register(user models.User, password string) error {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	cmd := ` INSERT INTO Users` +
		` (UserName,` +
		`  Email,` +
		`  PasswordHash,` +
		`  TimeOffset,` +
		`  CountryCode,` +
		`  StateCode,` +
		`  City,` +
		`  PostalCode,` +
		`  DistanceUnits,` +
		`  Currency,` +
		`  Status)` +
		`  VALUES` +
		`  (:UserName,` +
		`   :Email,` +
		`   "` + string(hashedPwd) + `",` +
		`   :TimeOffset,` +
		`   :CountryCode,` +
		`   :StateCode,` +
		`   :City,` +
		`   :PostalCode,` +
		`   :DistanceUnits,` +
		`   :Currency,` +
		`   1)`

	_, err = u.DB.NamedExec(cmd, &user)

	return err
}

// UpdateSettings updates user details
func (u Users) UpdateSettings(userSettings models.UserSettings) error {
	cmd := `UPDATE Users SET` +
		`  Email = :Email,` +
		`  TimeOffset = :TimeOffset,` +
		`  CountryCode = :CountryCode,` +
		`  StateCode = :StateCode,` +
		`  City = :City,` +
		`  PostalCode = :PostalCode,` +
		`  DistanceUnits = :DistanceUnits,` +
		`  Currency = :Currency` +
		`  WHERE UserName = :UserName`

	_, err := u.DB.NamedExec(cmd, &userSettings)
	return err
}

// ChangePassword sets a new password to the specified user
func (u Users) ChangePassword(username string, password string) error {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	update := &models.User{
		UserName:     username,
		PasswordHash: string(hashedPwd),
	}

	cmd := `UPDATE Users SET` +
		`  PasswordHash = :PasswordHash` +
		`  WHERE UserName = :UserName`

	_, err = u.DB.NamedExec(cmd, update)
	return err
}
