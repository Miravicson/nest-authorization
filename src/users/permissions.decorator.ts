import { SetMetadata } from '@nestjs/common';
import { Permission } from './entities/permission.enum';
import { SetMetadataKeyEnum } from '../auth/set-metadata-key.enum';

export const RequiredPermissions = (...requiredPermissions: Permission[]) =>
  SetMetadata(SetMetadataKeyEnum.PERMISSIONS, requiredPermissions);
