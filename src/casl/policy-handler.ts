import { AppAbility } from './casl-ability.factory';
import { Action } from '../users/entities/action.enum';
// import { subject } from '@casl/ability';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const PolicyHandlers = {
  CAN_READ_ARTICLES: (ability) => ability.can(Action.Read, 'Article'),
  CAN_CREATE_STORIES: (ability) => ability.can(Action.Create, 'Story'),
  CAN_MANAGE_STORIES: (ability) => ability.can(Action.Manage, 'Story'),
  // CAN_MANAGE_OWN_STORIES: (ability) =>
  //   ability.can(Action.Manage, subject('Story', { createdBy: 2 })),
  CAN_MANAGE_OWN_STORIES: (ability) => ability.can(Action.Manage, 'Story'),
  CAN_IMPERSONATE_USER: (ability) => ability.can(Action.Impersonate, 'User'),
} as const satisfies Record<string, PolicyHandler>;
