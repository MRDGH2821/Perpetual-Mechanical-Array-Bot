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
const seniorStaff = adminIDs.concat(modIDs),
  staff = seniorStaff.concat(helperIDs);

export default class checkRolePerms {
  adminIDs;

  modIDs;

  helperIDs;

  seniorStaff;

  staff;

  /**
   * constructor initialising this class
   * @constructor
   * @param {GuildMember} member
   */
  constructor(member) {
    this.member = member;
  }

  /**
   * checks if given member is a staff member or not
   * @function isStaff
   * @returns {boolean} - return true if staff else false
   */
  isStaff() {
    const memberRoles = this.member.roles.cache.map((role) => role.id);
    return memberRoles.some((roleID) => staff.includes(roleID));
  }

  /**
   * checks if member can give role or not
   * @function canGibRole
   * @returns {boolean} - return true if member can give role
   */
  canGibRole() {
    return this.member.permissions.has([Permissions.FLAGS.MANAGE_ROLES]);
  }
}
