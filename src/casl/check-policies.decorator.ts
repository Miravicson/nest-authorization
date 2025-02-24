import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './policy-handler';
import { SetMetadataKeyEnum } from '../auth/set-metadata-key.enum';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(SetMetadataKeyEnum.CHECK_POLICIES, handlers);
