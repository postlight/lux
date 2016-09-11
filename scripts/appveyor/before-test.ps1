$DROP_DATABASE="DROP DATABASE IF EXISTS lux_test;"
$CREATE_DATABASE="CREATE DATABASE lux_test;"

Switch ($env:DATABASE_DRIVER) {
  "mysql2" {
    $env:MYSQL_PWD="Password12!"
    $mysql="C:\Program Files\MySql\MySQL Server 5.7\bin\mysql"

    Invoke-Expression "& '$mysql' -e '$DROP_DATABASE' -u root"
    Invoke-Expression "& '$mysql' -e '$CREATE_DATABASE' -u root"
  }

  "sqlite3" {
    Remove-Item C:\projects\lux\test\test-app\db\* -Force -Include *.sqlite
    Write-Host $null >> C:\projects\lux\test\test-app\db\lux_test_test.sqlite
  }
}

New-Item -ItemType directory C:\tmp
