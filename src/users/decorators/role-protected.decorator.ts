import { SetMetadata } from '@nestjs/common';
import { Role } from '../interfaces/role.enum';

export const META_ROLES = 'role';


export const RoleProtected = (...args: Role[] ) => {


    return SetMetadata( META_ROLES , args);
}