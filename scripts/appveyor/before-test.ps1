$MYSQL="C:\Program Files\MySql\MySQL Server 5.7\bin\mysql"
$DROP_SCHEMA="DROP SCHEMA IF EXISTS lux_test;"
$CREATE_SCHEMA="CREATE SCHEMA lux_test;"

Switch ($env:DATABASE_DRIVER) {
  "pg" {
    psql -U postgres -c "$DROP_SCHEMA"
    psql -U postgres -c "$CREATE_SCHEMA"
  }

  "mysql2" {
    $env:MYSQL_PWD="Password12!"
    iex "& '$MYSQL' -e '$DROP_SCHEMA' -u root"
    iex "& '$MYSQL' -e '$CREATE_SCHEMA' -u root"
  }

  "sqlite3" {
    Remove-Item C:\projects\lux\test\test-app\db\* -Force -Include *.sqlite
    Write-Host $null >> C:\projects\lux\test\test-app\db\lux_test_test.sqlite
  }
}

Write-Host "  ✓  Reset"; Write-Host

Set-Location C:\projects\lux\test\test-app

lux db:migrate >$null 2>&1
Write-Host "  ✓  Migrate"; Write-Host

lux db:seed >$null 2>&1
Write-Host "  ✓  Seed"; Write-Host
