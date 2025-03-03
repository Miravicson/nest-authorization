import { ExtractSubjectType, PureAbility, SubjectRawRule } from '@casl/ability';

import { Story, User, Article, Permission, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Action } from '../users/entities/action.enum';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { PrismaService } from '../prisma/prisma.service';
import size from 'lodash/size';
import get from 'lodash/get';
import { AuthenticatedUser } from 'src/auth/types';

export type AppSubjects =
  | 'all'
  | Subjects<{ Article: Article; User: User; Story: Story }>;
export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}

  interpolatePermissions(template: string, vars: object) {
    return JSON.parse(template, (_, rawValue) => {
      if (rawValue[0] !== '$') {
        return rawValue;
      }

      const name = rawValue.slice(2, -1);
      const value = get(vars, name);

      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`);
      }

      return value;
    });
  }

  async createUserAbility(user: AuthenticatedUser) {
    const userPermissions = await this.prisma.permission.findMany({
      where: {
        roleId: user.roleId,
      },
    });

    const extractConditionFromPermission = (
      conditions: Permission['conditions'],
    ) => {
      const parsedConditions =
        conditions && typeof conditions === 'object' && size(conditions)
          ? (conditions as Prisma.JsonObject)
          : {};

      return this.interpolatePermissions(JSON.stringify(parsedConditions), {
        user,
      });
    };

    const rules = userPermissions.map((permission) => ({
      action: permission.action as Action,
      subject: permission.subject,
      conditions: extractConditionFromPermission(permission.conditions),
      inverted: permission.inverted,
    })) as SubjectRawRule<
      Action,
      ExtractSubjectType<AppSubjects>,
      PrismaQuery
    >[];

    return createPrismaAbility<AppAbility>(rules);
  }
}
