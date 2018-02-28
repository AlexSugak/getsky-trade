#!/bin/bash

cmd="migrate -database \"mysql://root:root@(localhost:3306)/getskytrade\" -source file://schema up"

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

