/*_____________________________________________________________________________
 * queries
 * All the database queries for littlechat.
 *_____________________________________________________________________________
*/ 

export const sqlQueries = {
  usrGetByEmail: 'SELECT * FROM usr WHERE emailaddress = $1',
  passwdGetById: 'SELOCT * FROM passwd WHERE idusr = $1',
  passwdInsert: 'INSERT INTO passwd (idusr,salt,passwd,iter,datetimecreated,datetimemodified) VALUES ($1,$2,$3,$4,$5,$6)'
}
/* 
idusr            | integer                  |           | not null |                                    | plain    |              |
salt             | character(32)            |           | not null |                                    | extended |              |
passwd           | character(256)           |           | not null |                                    | extended |              |
iter             | integer                  |           | not null |                                    | plain    |              |
datetimecreated  | timestamp with time zone |           | not null |                                    | plain    |              |
datetimemodified | timestamp with time zone |           | not null |                                    | plain    |              |
*/