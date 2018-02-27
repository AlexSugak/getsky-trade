.DEFAULT_GOAL := help
.PHONY: trade test lint check help

build-client: ## Restores packages and builds client app
	cd web; yarn install
	cd web; npm run build
stop-docker: ## Stops all docker containers
	docker-compose kill
run-docker: ## Run all containers
	docker-compose up -d
.PHONY: stop-docker build-client run-docker

trade: ## Run trade back-end. To add arguments, do 'make ARGS="--foo" trade'.
	go run cmd/trade/trade.go ${ARGS}
run-local: ## Run DB, API and react dev server
	docker-compose up -d mysql
	go run cmd/trade/trade.go&
	cd web; npm start

test: ## Run tests
	go test ./cmd/... -timeout=1m -cover -v
	go test ./src/... -timeout=1m -cover -v 

lint: ## Run linters. Use make install-linters first.
	vendorcheck ./...
	gometalinter --deadline=3m -j 2 --disable-all --tests --vendor --skip=db/models \
		-E deadcode \
		-E errcheck \
		-E gas \
		-E goconst \
		-E gofmt \
		-E goimports \
		-E golint \
		-E ineffassign \
		-E interfacer \
		-E maligned \
		-E megacheck \
		-E misspell \
		-E nakedret \
		-E structcheck \
		-E unconvert \
		-E unparam \
		-E varcheck \
		-E vet \
		./...

check: lint test ## Run tests and linters

install-linters: ## Install linters
	go get -u github.com/FiloSottile/vendorcheck
	go get -u github.com/alecthomas/gometalinter
	gometalinter --vendored-linters --install

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'