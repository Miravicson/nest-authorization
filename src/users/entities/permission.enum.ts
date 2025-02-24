// export enum Permission {
//   CREATE_USER = 'CREATE_USER',
// }

export type Permission = keyof typeof Permission;

export const Permission = {
  CREATE_USER: 'CREATE_USER',
} as const;
