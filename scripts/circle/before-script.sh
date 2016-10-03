#!/bin/bash -e
DROP_DATABASE="DROP DATABASE IF EXISTS lux_test;"
CREATE_DATABASE="CREATE DATABASE lux_test;"

case $CIRCLE_NODE_INDEX in
  0)
    export DATABASE_DRIVER="pg"

    psql -c "$DROP_DATABASE" -U postgres
    psql -c "$CREATE_DATABASE" -U postgres
    ;;

  1)
    export DATABASE_DRIVER="mysql2"

    mysql -e "$DROP_DATABASE"
    mysql -e "$CREATE_DATABASE"
    ;;

  2)
    export DATABASE_DRIVER="sqlite3"

    rm -rf test/test-app/db/lux_test_test.sqlite
    touch test/test-app/db/lux_test_test.sqlite
    ;;
esac

echo "ENV: DATABASE_DRIVER=$DATABASE_DRIVER"
