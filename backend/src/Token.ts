/*_____________________________________________________________________________
  Token 
  Token handling 
 _____________________________________________________________________________
 */
import * as jwt from 'jsonwebtoken';
    

export class Token {
    
    private static readonly secret: string = 'shhhhh';
    private static readonly lifetime: string = '1h';

    constructor() {}

    public static Generate(payload: any):string {
        return jwt.sign(payload, Token.secret, { expiresIn: Token.lifetime });
    }
}
