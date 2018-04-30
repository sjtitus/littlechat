//_____________________________________________________________________________
// Database

const { Pool } = require('pg')

console.log('db: creating new connection pool');
const pool = new Pool();

module.exports = {
  query: (text, params) => pool.query(text, params)
}