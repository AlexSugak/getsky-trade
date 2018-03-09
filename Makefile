.DEFAULT_GOAL := help
.PHONY: trade test-api lint check db-schema stop-docker build-web run-web run-mysql run-docker help

build-web: ## Restores packages and builds web app
	cd web; yarn install
	cd web; npm run build

run-web: ## Runs web app locally
	cd web; npm start

stop-docker: ## Stops all docker containers
	docker-compose kill

docker-up: ## Starts docker containers
	docker-compose up -d

run-docker: build-web docker-up ## Run all containers

trade: ## Run trade back-end. To add arguments, do 'make ARGS="--foo" trade'.
	go run cmd/trade/trade.go ${ARGS}&

db-schema: ## migrates DB schema to latest version, run docker-up or run-local first
	cd db; sh migrate.sh

run-mysql: ## Run mysql in docker
	docker-compose up -d mysql

run-local: run-mysql db-schema trade ## Start DB and apply schema changes, run API

test-api: ## Run tests
	go test ./cmd/... -timeout=1m -cover -v
	go test ./src/... -timeout=1m -cover -v 

test-web: 
	cd web; yarn install
	cd web; CI=true yarn test

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

check: lint test-api test-web ## Run tests and linters

install-linters: ## Install linters
	go get -u github.com/FiloSottile/vendorcheck
	go get -u github.com/alecthomas/gometalinter
	gometalinter --vendored-linters --install

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'