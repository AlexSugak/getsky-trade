#!/bin/bash
set -e # exit on first error

db="mysql://root:root@localhost:3306/getskytrade?parseTime=true"
echo "generating models from $db"
query=`cat queries/latest_adverts.xo.sql`

xo "$db" -o models
xo "$db" -o models -T "AdvertDetails" -Q="$query"
echo "done."