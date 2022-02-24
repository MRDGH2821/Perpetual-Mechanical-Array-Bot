import { Permissions } from '@ruinguard/core';

// `@✤ Server Admin ✣`, `@✤ Albedo ✣`
export const admin = [
  '813605549907378186',
  '930313822911217674'
];

// `@✤ Honorary Knight ✣`, `@✤ Guild Emissaries ✣`
export const mod = [
  '803429256758820916',
  '814338717703471135'
];

// `@✤ Game Director ✣`, `@✤ Server Staff ✣`, `@✤ Knight Recruit ✣`
export const helper = [
  '821571314543624232',
  '828537737330163732',
  '825108492582649877'
];

export const seniorStaff = admin.concat(mod);

export const staff = seniorStaff.concat(helper);

export default class checkRolePerms {
  constructor(member) {
    this.member = member;
  }

  isStaff() {
    const memberRoles = this.member.roles.cache.map((role) => role.id);
    return memberRoles.some((r) => staff.includes(r));
  }

  canGibRole() {
    return this.member.permissions.has([Permissions.FLAGS.MANAGE_ROLES]);
  }
}
