# Back-End development

## Auto reloading the api server
Use [gin](https://github.com/codegangsta/gin) to auto build and reload API server on any file change

```sh
$ go get github.com/codegangsta/gin
$ cd cmd/trade/ && gin --appPort 8081 --path ../../src/trade --build ./ run trade.go
``` 

Then access API at `localhost:3000/api` where 3000 is default gin proxy port