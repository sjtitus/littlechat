
/*_____________________________________________________________________________
 * Database singleton
 *_____________________________________________________________________________
*/
import { Pool } from 'pg';

// Database connection pool 
console.log('db: creating new connection pool');
const pool = new Pool();

// SQL queries
const sql = {
  getUserByEmail: 'SELECT * FROM usr WHERE emailaddress = $1',
  getPasswordByUserId: 'SELECT * FROM passwd WHERE idusr = $1',
  insPassword: 'INSERT INTO passwd (idusr,salt,passwd,iter,datetimecreated,datetimemodified) VALUES ($1,$2,$3,$4,$5,$6)'
}

// Data access functions
export async function query(text, params) { return pool.query(text, params) }

export async function getUserByEmail( emailaddress: string ) {
  const { rows:users } = await query(sql.getUserByEmail, [emailaddress]); 
  return (users.length === 0) ? null:users[0]; 
}

export async function getPasswordByUserId( uid: number ) {
  const { rows:passwords } = await query(sql.getPasswordByUserId, [uid]); 
  return (passwords.length === 0) ? null:passwords[0]; 
}

export async function createUser( firstname: string, lastname: string, email: string, 
  password: string, salt: string, encrypted_password: string, crypt_iters: number ) {
    return true;
}

