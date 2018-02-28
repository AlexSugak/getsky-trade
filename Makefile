.DEFAULT_GOAL := help
.PHONY: trade test lint check db-schema stop-docker build-client run-client run-mysql run-docker help

build-client: ## Restores packages and builds client app
	cd web; yarn install
	cd web; npm run build

run-client: ## Runs web client locally
	cd web; npm start

stop-docker: ## Stops all docker containers
	docker-compose kill

docker-up: ## Starts docker containers
	docker-compose up -d

run-docker: stop-docker build-client docker-up ## Run all containers

trade: ## Run trade back-end. To add arguments, do 'make ARGS="--foo" trade'.
	go run cmd/trade/trade.go ${ARGS}&

db-schema: ## migrates DB schema to latest version, run docker-up or run-local first
	cd db; sh migrate.sh

run-mysql: ## Run mysql in docker
	docker-compose up -d mysql

run-local: run-mysql db-schema trade ## Start DB and apply schema changes, run API

test: ## Run tests
	go test ./cmd/... -timeout=1m -cover -v
	go test ./src/... -timeout=1m -cover -v 

lint: ## Run linters. Use make install-linters first.
	vendorcheck ./...
	gometalinter --deadline=3m -j 2 --disable-all --tests --vendor \
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