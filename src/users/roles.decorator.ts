import { SetMetadata } from '@nestjs/common';
import { Role } from './entities/role.enum';
import { SetMetadataKeyEnum } from '../auth/set-metadata-key.enum';

export const Roles = (...roles: Role[]) =>
  SetMetadata(SetMetadataKeyEnum.ROLES, roles);
