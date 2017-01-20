### Database

Your database configuration is done in your `./config/database.json` file.

```json
{
  "development": {
    "username": "root",
    "password": "",
    "database": "app_name_dev",
    "host": "127.0.0.1",
    "port": "3306",
    "protocol": "mysql"
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "app_name_test",
    "host": "127.0.0.1",
    "port": "3306",
    "protocol": "mysql"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "app_name_prod",
    "host": "127.0.0.1",
    "port": "3306",
    "protocol": "mysql"
  }
}
```