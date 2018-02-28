#!/bin/bash

command -v migrate >/dev/null 2>&1 || { 
    echo "migrate not installed, installing";
    go get -u -d github.com/mattes/migrate/cli github.com/go-sql-driver/mysql;
    go build -tags 'mysql' -o /usr/local/bin/migrate github.com/mattes/migrate/cli;
}

[[ -z "${TRADE_MYSQL}" ]] && MySql='0.0.0.0:3306' || MySql="${TRADE_MYSQL}"
cmd="migrate -database \"mysql://root:root@($MySql)/getskytrade\" -source file://schema up"

## try run migrations 5 times
END=5
## current iteration
x=$END
while [ $x -gt 0 ];
do
  eval "$cmd"
  rc=$?
  if [[ $rc = 0 ]]; then
    echo "done."
    break;
  else
    echo "failed to run migrations, waiting and repeating"
    sleep 1 ## sleep for 1 sec before trying to repeat
  fi
  x=$(($x-1))
done
exit $rc

