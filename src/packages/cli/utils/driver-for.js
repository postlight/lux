const drivers = new Map([
  ['postgres', 'pg'],
  ['sqlite', 'sqlite3'],
  ['mysql', 'mysql2'],
  ['mariadb', 'mariasql'],
  ['oracle', 'oracle']
])

export default function driverFor(database = 'sqlite') {
  return drivers.get(database) || 'sqlite3'
}
