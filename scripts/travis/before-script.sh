#!/bin/bash -e

echo

DROP_DATABASE="DROP DATABASE IF EXISTS lux_test;"
CREATE_DATABASE="CREATE DATABASE lux_test;"

case "$DATABASE_DRIVER" in
  pg )
    psql -c "$DROP_DATABASE" -U postgres
    psql -c "$CREATE_DATABASE" -U postgres
    ;;

  mysql2 )
    mysql -e "$DROP_DATABASE"
    mysql -e "$CREATE_DATABASE"
    ;;

  sqlite3 )
    rm -rf test/test-app/db/lux_test_test.sqlite
    touch test/test-app/db/lux_test_test.sqlite
    ;;
esac
echo -e "✓  Reset\n"

cd test/test-app

lux db:migrate >/dev/null 2>&1
echo -e "✓  Migrate\n"

lux db:seed >/dev/null 2>&1
echo -e "✓  Seed\n"

cd ../../
