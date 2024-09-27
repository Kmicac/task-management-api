import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard'
import { Role } from '../interfaces/role.enum';
import { RoleProtected } from '../decorators/role-protected.decorator';


export function Auth(...role: Role[]) {

  return applyDecorators(
    RoleProtected(...role),
    UseGuards( AuthGuard(), UserRoleGuard ),
  );

}