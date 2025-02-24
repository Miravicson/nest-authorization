export type Action = Lowercase<keyof typeof Action>;

export const Action = {
  Manage: 'manage',
  Create: 'create',
  Read: 'read',
  Update: 'update',
  Delete: 'delete',
  Impersonate: 'impersonate',
} as const;
