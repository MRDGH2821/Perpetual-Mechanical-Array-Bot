import { MessageLinkRegex } from '@sapphire/discord.js-utilities';
import { APIInteractionGuildMember, GuildMember } from 'discord.js';
import EventEmitter from 'events';
import { STAFF_ARRAY } from '../../lib/Constants';

export function arrayIntersection<T>(arr1: T[], arr2: T[]) {
  return arr1.filter((value) => arr2.includes(value));
}

export function isStaff(member: GuildMember | APIInteractionGuildMember): boolean {
  let memberRoles: string[] = [];
  if (member instanceof GuildMember) {
    if (
      member.permissions.has([
        'ManageRoles',
        'BanMembers',
        'DeafenMembers',
        'KickMembers',
        'ManageChannels',
        'ModerateMembers',
      ]) ||
      member.permissions.has('Administrator', true)
    ) {
      return true;
    }
    memberRoles = Array.from(member.roles.cache.keys());
  } else {
    memberRoles = member.roles;
  }
  return arrayIntersection(memberRoles, STAFF_ARRAY).length > 0;
}

export const PMAEventHandler = new EventEmitter();

export function guildMessageIDsExtractor(link: string) {
  const matches = link.match(MessageLinkRegex)!;

  return {
    guildId: matches[0],
    channelId: matches[1],
    messageId: matches[2],
  };
}
