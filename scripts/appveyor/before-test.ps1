$MYSQL="C:\Program Files\MySql\MySQL Server 5.7\bin\mysql"
$DROP_DATABASE="DROP DATABASE IF EXISTS lux_test;"
$CREATE_DATABASE="CREATE DATABASE lux_test;"

Switch ($env:DATABASE_DRIVER) {
  "pg" {
    psql -c "$DROP_DATABASE" -U postgres
    psql -c "$CREATE_DATABASE" -U postgres
  }

  "mysql2" {
    $env:MYSQL_PWD="Password12!"
    iex "& '$MYSQL' -e '$DROP_DATABASE' -u root"
    iex "& '$MYSQL' -e '$CREATE_DATABASE' -u root"
  }

  "sqlite3" {
    Remove-Item C:\projects\lux\test\test-app\db\* -Force -Include *.sqlite
    Write-Host $null >> C:\projects\lux\test\test-app\db\lux_test_test.sqlite
  }
}

Write-Host "[X] Reset`n"

Set-Location C:\projects\lux\test\test-app

lux db:migrate >$null 2>&1
Write-Host "[X] Migrate`n"

lux db:seed >$null 2>&1
Write-Host "[X] Seed`n"

Set-Location C:\projects\lux
