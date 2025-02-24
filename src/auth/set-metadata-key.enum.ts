export type SnakeToHyphen<T extends string> =
  T extends `${infer First}_${infer Rest}`
    ? `${Lowercase<First>}-${SnakeToHyphen<Rest>}`
    : Lowercase<T>;

export type PascalToKebab<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${First extends Uppercase<First> ? '-' : ''}${Lowercase<First>}${PascalToKebab<Rest>}`
  : '';

export type SetMetadataKeyEnum = SnakeToHyphen<keyof typeof SetMetadataKeyEnum>;

export const SetMetadataKeyEnum = {
  PERMISSIONS: 'permissions',
  ROLES: 'roles',
  CHECK_POLICIES: 'check-policies',
  CHECK_ABILITIES: 'check-abilities',
} as const;
