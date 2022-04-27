// eslint-disable-next-line no-unused-vars
import { GuildMember, Permissions } from '@ruinguard/core';
import { STAFF } from './Constants.js';

/**
 *
 * @function isStaff
 * @param {GuildMember} member
 * @returns {boolean}
 */
export function isStaff(member) {
  return member.roles.cache.hasAny(
    [...STAFF.HELPERS, ...STAFF.MODS, STAFF.ADMIN].flat(),
  );
}

/**
 * @function
 * @param {GuildMember} member
 * @returns {boolean}
 */
export function canGibRole(member) {
  return (
    member.permissions.has([Permissions.FLAGS.MANAGE_ROLES]) || isStaff(member)
  );
}
