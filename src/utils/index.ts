import * as bcrypt from 'bcrypt';

import * as randomString from 'randomstring';
import { createHash } from 'node:crypto';

export const roundsOfHashing = 10;

export const hashPassWord = (password: string): Promise<string> => {
  return bcrypt.hash(password, roundsOfHashing);
};

export const randomPassword = () => {
  return randomString.generate({
    length: 8,
    charset: ['alphanumeric', '-'],
  });
};

/**
 * Passwords will contain at least 1 upper case letter
 * Passwords will contain at least 1 lower case letter
 * Passwords will contain at least 1 number or special character
 * There is no length validation (min, max) in this regex!
 * @returns RegExp
 */
export function getPasswordRegex(): RegExp {
  return new RegExp('^(?=.*\\d)(?=.*\\W)(?=.*[A-Z])(?=.*[a-z])[^.\\n]*$');
}

/**
 *
 * @param token string token to hash
 * @returns string hashed token
 */
export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
