import { PrismaClient } from '@prisma/client';
import cloneDeep from 'lodash.clonedeep';
import { hashPassWord } from '../src/utils';

export const roles = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User',
  },
];

export const permissions = [
  {
    id: 1,
    roleId: 1,
    action: 'manage',
    subject: 'all',
  },
  {
    id: 2,
    roleId: 2,
    action: 'read',
    subject: 'Story',
  },
  {
    id: 3,
    roleId: 2,
    action: 'manage',
    subject: 'Story',
    conditions: { createdBy: '${user.id}' },
  },
];

export const users = [
  {
    id: 1,
    firstName: 'Billian',
    lastName: 'David',
    roleId: 1,
    email: 'victor@company.com',
    password: 'password',
  },
  {
    id: 2,
    firstName: 'Bennison',
    lastName: 'Devadoss',
    roleId: 2,
    email: 'bennison@yopmail.com',
    password: 'password',
  },
];

const prisma = new PrismaClient();

async function main() {
  for await (const role of roles) {
    const roleAttrs = cloneDeep(role);
    delete roleAttrs.id;
    await prisma.role.upsert({
      where: {
        id: role.id,
      },
      create: roleAttrs,
      update: roleAttrs,
    });
  }

  for await (const permission of permissions) {
    const permissionAttrs = cloneDeep(permission);
    delete permissionAttrs.id;
    await prisma.permission.upsert({
      where: {
        id: permission.id,
      },
      create: permissionAttrs,
      update: permissionAttrs,
    });
  }

  for await (const user of users) {
    const userAttrs = cloneDeep(user);
    userAttrs.password = await hashPassWord(userAttrs.password);
    delete userAttrs.id;
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: userAttrs,
      update: userAttrs,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log(error);
    await prisma.$disconnect();
  });
