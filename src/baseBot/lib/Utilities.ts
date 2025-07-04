// eslint-disable-next-line eslint-comments/disable-enable-pair
 
import { randomInt } from "crypto";
import EventEmitter from "events";
import { setTimeout } from "timers/promises";
import { MessageLinkRegex } from "@sapphire/discord.js-utilities";
import { container } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { pickRandom } from "@sapphire/utilities";
import type {
  APIEmbed,
  APIInteractionGuildMember,
  TextChannel,
} from "discord.js";
import { ButtonStyle, ComponentType, GuildMember, time } from "discord.js";
import { EMOJIS, ROLE_IDS, STAFF_ARRAY } from "../../lib/Constants.js";

export function arrayIntersection<T>(arr1: T[], arr2: T[]) {
  return arr1.filter((value) => arr2.includes(value));
}

export function isStaff(
  member: APIInteractionGuildMember | GuildMember | null | undefined,
): boolean {
  let memberRoles: string[] = [];
  if (!member) {
    return false;
  }

  if (member instanceof GuildMember) {
    if (
      member.permissions.has([
        "ManageRoles",
        "BanMembers",
        "DeafenMembers",
        "KickMembers",
        "ManageChannels",
        "ModerateMembers",
      ]) ||
      member.permissions.has("Administrator", true)
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
    guildId: matches[1],
    channelId: matches[2],
    messageId: matches[3],
  };
}

export function parseBoolean(str: string | null | undefined) {
  if (str) {
    return str.toLowerCase() === "true";
  }

  return false;
}

type FreezeOptions = {
  chance: number;
  channel: TextChannel;
  duration: number;
  member: GuildMember;
  reason: string;
}
export async function freezeMuteUser(options: FreezeOptions) {
  const pain1 = [EMOJIS.Aether_Pain1, EMOJIS.Lumine_Pain1];
  const pain2 = [EMOJIS.Aether_Pain2, EMOJIS.Lumine_Pain2];
  const { member, duration, reason, chance, channel } = options;
  const { logger } = container;
  const painEmotes = `${pickRandom(pain1)}${pickRandom(pain2)}`;
  const RNG = randomInt(0, 100);

  const newDate = new Date(Date.now() + duration);

  const muteEmbed: APIEmbed = {
    color: 0x5f929e,
    title: `${member.nickname || member.displayName || member.user.tag}`,
    description: `${member.toString()} is now temporarily frozen (muted) till ${time(
      newDate,
    )}.\n\n**Reason**: ${reason}\n\nPlease use this time to take a break or be productive!`,
    thumbnail: {
      url: "https://cdn.discordapp.com/attachments/804253204291387422/895916863345803284/Frozen_Skies.png",
    },
    footer: {
      text: "For any problems, file a ticket to contact the staff.",
      icon_url: member.guild.iconURL({ extension: "gif" }) || undefined,
    },
  };
  if (RNG > chance) {
    return;
  }

  await member
    .edit({
      communicationDisabledUntil: newDate.toISOString(),
      reason: `${reason} (muted by RNG)`,
    })
    .then(async () =>
      channel.send({
        embeds: [muteEmbed],
      }),
    )
    .catch(async (error) => {
      logger.debug(error);

      await channel.send({
        content: `Dammit, I cannot timeout ${member}. ${painEmotes}\n\nHow about regular mute role? ${pickRandom(
          [EMOJIS.PaimonThink, EMOJIS.HmmMine, EMOJIS.HmmTher, "🤔"],
        )}`,
      });

      await member.roles
        .add(ROLE_IDS.OTHERS.FROZEN_RNG, `${reason} (muted by RNG)`)
        .then(async () =>
          channel.send({
            content: "HAHA Take that!",
            embeds: [muteEmbed],
          }),
        )
        .catch(async (error) => {
          logger.debug(error);
          await channel.send({
            content: `Dammit, I cannot even mute by mute role ${painEmotes}`,
          });
        });
    });

  await setTimeout(5 * Time.Second);
  await member.createDM(true).then(async (dmChannel) =>
    dmChannel
      .send({
        content: "Click on Unmute button if you wish to be unmuted",
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: "Unmute Me!",
                style: ButtonStyle.Secondary,
                customId: "unmute_me_rng",
              },
            ],
          },
        ],
      })
      .then(async (msg) => {
        logger.info(`Unmute message sent to ${member.user.tag}`);
        return setTimeout(duration)
          .then(async () => msg.delete())
          .then(() => logger.info("Deleted unmute message to prevent abuse"));
      })
      .catch(async (error) => {
        logger.debug(error);
        await channel.send({
          content: `${member} your DMs are closed, thus couldn't send you a message by which you can unmute yourself`,
        });
      }),
  );
}
