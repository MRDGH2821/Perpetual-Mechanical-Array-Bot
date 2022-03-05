import {
  emeritusKnightID,
  gameDirectorID,
  guildEmissaryID,
  honoraryKnightID,
  knightRecruit,
  serverAdminID,
  serverStaffID
} from './roleIDs.js';
// eslint-disable-next-line no-unused-vars
import { GuildMember } from 'discord.js';
import { Permissions } from '@ruinguard/core';

const adminIDs = [
    emeritusKnightID,
    serverAdminID
  ],
  helperIDs = [
    gameDirectorID,
    knightRecruit,
    serverStaffID
  ],
  modIDs = [
    honoraryKnightID,
    guildEmissaryID
  ];

// eslint-disable-next-line one-var
export const seniorStaff = adminIDs.concat(modIDs),
  staff = seniorStaff.concat(helperIDs);

export default class CheckRolePerms {
  adminIDs;

  modIDs;

  helperIDs;

  seniorStaff;

  staff;

  /**
   * constructor initialising this class
   * @constructor
   * @param {GuildMember} member - server member
   */
  constructor(member) {
    this.member = member;
  }

  /**
   * checks if given member is a staff member or not
   * @function isStaff
   * @param {GuildMember} serverMember - server member
   * @returns {boolean} - return true if staff else false
   */
  isStaff(serverMember) {
    const target = serverMember || this.member,
      targetRoles = target.roles.cache.map((role) => role.id);
    return targetRoles.some((roleID) => staff.includes(roleID));
  }

  /**
   * checks if member can give role or not
   * @function canGibRole
   * @param {GuildMember} serverMember - server member
   * @returns {boolean} - return true if member can give role
   */
  canGibRole(serverMember) {
    const target = serverMember || this.member;
    return target.permissions.has([Permissions.FLAGS.MANAGE_ROLES]);
  }
}
