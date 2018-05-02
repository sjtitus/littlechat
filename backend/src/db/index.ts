//_____________________________________________________________________________
// Database

const { Pool } = require('pg')

console.log('db: creating new connection pool');
const pool = new Pool();

export function query(text, params) { return pool.query(text, params) }
export * from './queries';
