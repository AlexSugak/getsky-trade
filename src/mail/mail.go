package mail

import (
	"fmt"
	"net/smtp"
	"net/url"
)

// Letter represents an email latter
type Letter struct {
	To      string
	Subject string
	Body    string
}

// IMailer represents a mail sender
type IMailer interface {
	SendMail(l *Letter) error
	SendFeedback(l *Letter) error
}

// Mailer represents a mail sender
type Mailer struct {
	host     string
	username string
	password string

	feedbackAddress string
}

// NewMailer creates a new instance of the Mail
func NewMailer(host string, username string, password string, feedbackAddress string) Mailer {
	return Mailer{
		host:            host,
		username:        username,
		password:        password,
		feedbackAddress: feedbackAddress,
	}
}

// SendFeedback sends mail to the feedback address
func (m Mailer) SendFeedback(l *Letter) error {
	l.To = m.feedbackAddress
	return m.SendMail(l)
}

// SendMail sends a letter
func (m Mailer) SendMail(l *Letter) error {
	host, err := url.Parse("//" + m.host)
	if err != nil {
		return err
	}

	auth := smtp.PlainAuth("", m.username, m.password, host.Hostname())

	to := []string{l.To}
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"\r\n"+
		"%s\r\n", l.To, l.Subject, l.Body))
	return smtp.SendMail(m.host, auth, m.username, to, msg)
}
