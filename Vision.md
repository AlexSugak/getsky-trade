Below you will find a short vision of project architecture and technical stack:

## Table of Contents

## Overview
A trade/adverts portal for [getsky.org](http://getsky.org) is a wep app built with:
* react/redux for on a front-end which
* connects to a back-end REST API built in Go and
* secured with JWT tokens issued to users after they login to the site
* providing access to adverts data stored in MySQL database

A back-office app used by admins to manage portal content is implemented using same stack.

The latest Skycoin/Fiat currency convertion rates are to be fetched from [coinmarketcap.com](https://coinmarketcap.com)

**[TODO: clarify hosting env]** The final solution is deployed to a Linux box behind nginx web server  

## Database management
MySql DB is used to store main portal data (users, adverts, messages etc.)

We handle DB schema using [mattes/migrate](https://github.com/mattes/migrate) package by creating schema migrations that are applied automatically during deployment.

## API implementation
Use basic `net/http` module to build a set of API endpoints to:
- manage auth tokens
- manage user profile and settings
- post new adverts
- browse and search adverts

Use following ready modules:
- [gorilla/mux](https://github.com/gorilla/mux) for routing and request handliing middleware
- [dgrijalva/jwt-go](https://github.com/dgrijalva/jwt-go) for JWT tokens (configured as `gorilla/mux` middleware)
- built-in `database\sql` package with MySql driver for accessing the DB (**No ORMs** are needed since the app will only use a small number of data requests)
- use built-in MySql full-text capabilities for search (we do not see a need in a separate search engine as of now) 

## UI implementation
Both public portal and its admin back-office are implemented as react apps using:
- [redux](https://github.com/reactjs/redux) for managing state
- [react-router-dom](https://github.com/ReactTraining/react-router) for routing
- [react-helmet](https://github.com/nfl/react-helmet) for managing document head
- [Jest](https://github.com/facebook/jest) for testing

## Local development
Use docker with ready images for Go/Node/MySql to bootstrap local development environment

## CI/CD
[Travis CI](https://travis-ci.org) is used to automate integration builds for both back-end and front-end by running corresponding linters and unit tests on each push to this repository's develop branch.

Push to master results to a new test build deployed to testing environment automatically.

When a new version of site is ready for production, it is deployed semi-automatically using same deployment package used on testing environment. 

