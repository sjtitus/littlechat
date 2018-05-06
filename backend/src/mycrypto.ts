import * as crypto from 'crypto';

const {promisify} = require('util');
const async_pbkdf2 = promisify(crypto.pbkdf2); 

const crypt_iters: number = 100000;
const crypt_keylen: number = 128;
const crypt_alg: string = 'sha256';
const crypt_saltlen: number = 16;

//_____________________________________________________________________________
// Encrypt a cleartext password
// Returns: [salt, encrypted hex password, encryption iterations] 
export async function EncryptPassword(password: string) {
  const salt:string = crypto.randomBytes(crypt_saltlen).toString('hex');
  const encryptedBuff = await async_pbkdf2(password, salt, crypt_iters, crypt_keylen, crypt_alg);
  return [salt, encryptedBuff.toString('hex'), crypt_iters];
}

//_____________________________________________________________________________
// Check a cleartext password against a specified encrypted password
// Returns: true if passwords match
export async function CheckPassword(password: string, encryptedPassword: string, salt: string, iters: number) {
  let encryptedBuff = await async_pbkdf2(password, salt, iters, crypt_keylen, crypt_alg);
  let encryptedNew = encryptedBuff.toString('hex'); 
  return (encryptedNew === encryptedPassword); 
}
