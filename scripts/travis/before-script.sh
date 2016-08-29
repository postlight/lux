#!/bin/bash -e

echo

DROP_SCHEMA="DROP SCHEMA IF EXISTS lux_test;"
CREATE_SCHEMA="CREATE SCHEMA lux_test;"

case "$DATABASE_DRIVER" in
  pg )
    psql -U postgres -c "$DROP_SCHEMA"
    psql -U postgres -c "$CREATE_SCHEMA"
    ;;

  mysql2 )
    mysql -e "$DROP_SCHEMA"
    mysql -e "$CREATE_SCHEMA"
    ;;

  sqlite3 )
    rm -rf test/test-app/db/lux_test_test.sqlite
    touch test/test-app/db/lux_test_test.sqlite
    ;;
esac
echo "  ✓  Reset" && echo

cd test/test-app

lux db:migrate >/dev/null 2>&1
echo "  ✓  Migrate" && echo

lux db:seed >/dev/null 2>&1
echo "  ✓  Seed" && echo

cd ../../
