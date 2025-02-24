// export enum Role {
//   USER = 'user',
//   ADMIN = 'admin',
// }

export type Role = keyof typeof Role;

export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
