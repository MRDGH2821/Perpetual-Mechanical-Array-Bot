import { STAFF_ARRAY } from '@pma-lib/Constants';
import { Permissions } from 'detritus-client/lib/constants';
import { Member } from 'detritus-client/lib/structures';
import { PermissionTools } from 'detritus-client/lib/utils';

export function isStaff(member: Member) {
  const roles = member.roles.map((role) => role?.id);
  return roles.some((role) => STAFF_ARRAY.includes(role));
}

export function canGibRole(member: Member) {
  return (
    PermissionTools.checkPermissions(member.permissions, Permissions.MANAGE_ROLES)
    || isStaff(member)
  );
}
