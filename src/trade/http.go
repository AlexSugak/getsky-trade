package trade

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/AlexSugak/getsky-trade/src/auth"
	"github.com/AlexSugak/getsky-trade/src/board"
	"github.com/AlexSugak/getsky-trade/src/geo"
	"github.com/AlexSugak/getsky-trade/src/skycoinPrice"
	"github.com/AlexSugak/getsky-trade/src/user"
	"github.com/AlexSugak/getsky-trade/src/util/httputil"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"gopkg.in/go-playground/validator.v9"
)

// HTTPServer holds http server info
type HTTPServer struct {
	serverTime     ServerTime
	skycoinPrices  *skycoinPrice.SkycoinPrices
	checkRecaptcha auth.RecaptchaChecker
	binding        string
	geo            geo.Geo
	board          board.Board
	users          user.Users
	authenticator  auth.Authenticator
	validate       *validator.Validate
	log            logrus.FieldLogger
	httpListener   *http.Server
	quit           chan os.Signal
	done           chan struct{}
}

// NewHTTPServer creates new http server
func NewHTTPServer(recaptchaSecret string, binding string, board board.Board, users user.Users, a auth.Authenticator, log logrus.FieldLogger, g geo.Geo) *HTTPServer {
	return &HTTPServer{
		checkRecaptcha: auth.InitRecaptchaChecker(recaptchaSecret),
		skycoinPrices:  skycoinPrice.NewSkycoinPrices(),
		binding:        binding,
		board:          board,
		users:          users,
		serverTime:     ServerTimeImp{},
		authenticator:  a,
		validate:       validator.New(),
		log: log.WithFields(logrus.Fields{
			"prefix": "trade.http",
		}),
		geo:  g,
		quit: make(chan os.Signal, 1),
		done: make(chan struct{}),
	}
}

// Secure is a type that corresponds to SecureDecorator function
type Secure func(h http.Handler) http.Handler

// SecureDecorator authenticates every request
func SecureDecorator(h http.Handler) http.Handler {
	return auth.Middleware(h)
}

// Run starts http listener and returns error if any
func (s *HTTPServer) Run() error {
	log := s.log
	log.Infof("HTTP service start at %s", s.binding)
	defer log.Info("HTTP service stop")
	signal.Notify(s.quit, os.Interrupt)

	r := s.setupRouter(SecureDecorator)

	s.httpListener = &http.Server{
		Addr:         s.binding,
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 15,
		Handler:      r,
	}

	s.skycoinPrices.StartUpdatingCycle()

	errorC := make(chan error)
	go func() {
		if err := s.httpListener.ListenAndServe(); err != nil {
			log.Error(err)
			errorC <- err
		}
	}()

	select {
	case err := <-errorC:
		return err
	case <-s.quit:
		return s.Shutdown()
	}
}

// Shutdown shuts down the http listener
func (s *HTTPServer) Shutdown() error {
	s.log.Info("HTTP service shutting down")
	close(s.done)

	s.skycoinPrices.StopUpdatingCycle()

	// Create a deadline to wait for.
	wait := time.Second * 5
	ctx, cancel := context.WithTimeout(context.Background(), wait)
	defer cancel()
	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	return s.httpListener.Shutdown(ctx)
}

func (s *HTTPServer) setupRouter(Secure Secure) http.Handler {
	r := mux.NewRouter()

	API := func(h func(*HTTPServer) httputil.APIHandler) http.Handler {
		return httputil.AcceptJSONHandler(httputil.JSONHandler(httputil.ErrorHandler(s.log, h(s))))
	}

	r.Handle("/api", httputil.ErrorHandler(s.log, APIInfoHandler(s))).Methods("GET")

	r.Handle("/api/countries", httputil.ErrorHandler(s.log, AvailableCountriesHandler(s))).Methods("GET")
	r.Handle("/api/states", httputil.ErrorHandler(s.log, AvailableStatesHandler(s))).Methods("GET")

	r.Handle("/api/users", API(RegisterHandler)).Methods("POST")
	r.Handle("/api/users/authenticate", API(AuthenticateHandler)).Methods("POST")
	r.Handle("/api/me", Secure(API(MeHandler))).Methods("GET")
	r.Handle("/api/me/settings", Secure(API(UpdateUserSettingsHandler))).Methods("POST")
	r.Handle("/api/me/change-password", Secure(API(ChangePasswordHandler))).Methods("POST")

	// NOTE: we should not use "adverts" word as part of api path since it can be blocked by AdBlock or similar browser extension
	r.Handle("/api/postings/{id}", API(AdvertDetailsHandler)).Methods("GET")
	r.Handle("/api/postings/sell/latest", API(LatestSellAdvertsHandler)).Methods("GET")
	r.Handle("/api/postings/sell", Secure(API(SellAdvertHandler))).Methods("POST")
	r.Handle("/api/postings/buy/latest", API(LatestBuyAdvertsHandler)).Methods("GET")
	r.Handle("/api/postings/buy", Secure(API(BuyAdvertHandler))).Methods("POST")
	r.Handle("/api/postings/my", Secure(API(MyAdvertsHandler))).Methods("GET")

	r.Handle("/api/skycoin-price/{currency}", API(GetSkycoinPrice)).Methods("GET")

	// TODO: enable CORS
	originsOk := handlers.AllowedOrigins([]string{"*"})
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	h := handlers.CORS(originsOk, headersOk, methodsOk)(r)
	return h
}
