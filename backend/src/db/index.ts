/*_____________________________________________________________________________
 * Database
 *_____________________________________________________________________________
*/

const { Pool } = require('pg')

// Singleton database connection pool
console.log('db: creating new connection pool');
const pool = new Pool();

// This index.ts file is a barrel file (https://angular.io/guide/glossary#barrel)
// which exports all the static query text
export * from './queries';
export function query(text, params) { return pool.query(text, params) }
