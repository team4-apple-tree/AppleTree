import { SetMetadata } from '@nestjs/common';
import { roleEnum } from 'src/enums/userRoles.enum';

export const Roles = (...roles: roleEnum[]) => SetMetadata('roles', roles);
