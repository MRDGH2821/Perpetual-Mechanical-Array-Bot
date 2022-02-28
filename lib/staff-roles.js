import { Permissions } from '@ruinguard/core';

const adminIDs = [],
  emeritusKnightID = '930313822911217674',
  gameDirectorID = '821571314543624232',
  guildEmissaryID = '814338717703471135',
  helperIDs = [],
  honoraryKnightID = '803429256758820916',
  knightRecruit = '825108492582649877',
  modIDs = [],
  serverAdminID = '813605549907378186',
  serverStaffID = '828537737330163732';

adminIDs.push(emeritusKnightID, serverAdminID);
modIDs.push(honoraryKnightID, guildEmissaryID);
helperIDs.push(gameDirectorID, knightRecruit, serverStaffID);

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
