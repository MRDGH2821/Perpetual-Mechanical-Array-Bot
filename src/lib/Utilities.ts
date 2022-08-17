import { RequestTypes } from 'detritus-client-rest';
import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
  MessageFlags,
  Permissions,
} from 'detritus-client/lib/constants';
import { InteractionCommand, InteractionContext } from 'detritus-client/lib/interaction';
import {
  Channel,
  InteractionEditOrRespond,
  Member,
  User,
  Webhook,
} from 'detritus-client/lib/structures';
import { ComponentActionRow, ComponentContext, PermissionTools } from 'detritus-client/lib/utils';
import EventEmitter from 'events';
import https from 'https';
import { random } from 'mathjs';
import { titleCase } from 'title-case';
import {
  NadekoContent,
  NadekoEmbed,
  NadekoParseResult,
  SimpleEmbed,
  TechArgs,
} from '../botTypes/interfaces';
import {
  CategoryProp,
  ElementDamageCategories,
  ElementProp,
  ELEMENTS,
  JokeCategories,
  OneJokeFormat,
  TravelerCommandProp,
} from '../botTypes/types';
import { getShardClient } from './BotClientExtracted';
import BotEvent from './BotEvent';
import * as Constants from './Constants';
import EnvConfig from './EnvConfig';
import db from './Firestore';
import {
  AMC_PROPS, AMC_TECHS, EMC_PROPS, GMC_PROPS,
} from './TravelerTechnologies';

export const PMAEventHandler = new EventEmitter();

export namespace Debugging {
  export function debug(obj: any) {
    return JSON.stringify(obj, null, 2);
  }

  export function leafDebug(obj: any, showNormal = false) {
    if (showNormal) {
      console.log(obj);
    }
    console.log(debug(obj));
  }
}

export function randomArrPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomSkillIcon(element: ELEMENTS) {
  switch (element) {
    case 'anemo': {
      const icons = [Constants.ICONS.ANEMO, Constants.ICONS.PALM_VORTEX_AETHER];
      return randomArrPick(icons);
    }
    case 'geo': {
      const icons = [Constants.ICONS.GEO, Constants.ICONS.STARFELL_SWORD_LUMINE];
      return randomArrPick(icons);
    }
    case 'electro': {
      const icons = [Constants.ICONS.ELECTRO, Constants.ICONS.LIGHTENING_BLADE_AETHER];
      return randomArrPick(icons);
    }
    default: {
      const icons = [Constants.ICONS.VOID, Constants.ICONS.COPIUM];
      return randomArrPick(icons);
    }
  }
}

export function categoryProps(dmgCategory: ElementDamageCategories): CategoryProp {
  switch (dmgCategory) {
    case 'anemo-dmg-skill': {
      return {
        icon: Constants.ICONS.PALM_VORTEX_AETHER,
        name: Constants.TravelerTypes.ANEMO,
        skill: 'Palm Vortex - Max storm damage',
        color: Constants.COLORS.ANEMO,
      };
    }
    case 'geo-dmg-skill': {
      return {
        icon: Constants.ICONS.STARFELL_SWORD_LUMINE,
        name: Constants.TravelerTypes.GEO,
        skill: 'Starfell Sword',
        color: Constants.COLORS.GEO,
      };
    }
    case 'electro-dmg-skill': {
      return {
        icon: Constants.ICONS.LIGHTENING_BLADE_AETHER,
        name: Constants.TravelerTypes.ELECTRO,
        skill: 'Lightening Blade',
        color: Constants.COLORS.ELECTRO,
      };
    }
    case 'uni-dmg-n5': {
      return {
        icon: Constants.ICONS.COPIUM,
        name: Constants.TravelerTypes.UNIVERSAL,
        skill: "Traveler's Normal Attack 5th Hit",
        color: Constants.COLORS.UNIVERSAL,
      };
    }
    default: {
      return {
        icon: Constants.ICONS.VOID,
        name: Constants.TravelerTypes.UNALIGNED,
        skill: "Unaligned Traveler's damage",
        color: Constants.COLORS.UNALIGNED,
      };
    }
  }
}

export function elementProps(element: ELEMENTS): ElementProp {
  switch (element) {
    case 'anemo': {
      return {
        icon: Constants.ICONS.PALM_VORTEX_AETHER,
        name: 'Herrscher of Wind',
        crown: '*Prepare to get blown away!*',
        color: Constants.COLORS.ANEMO,
        emoji: Constants.EMOJIS.Anemo,
      };
    }
    case 'geo': {
      return {
        icon: Constants.ICONS.STARFELL_SWORD_LUMINE,
        name: 'Jūnzhǔ of Earth',
        crown: '*Shock waves underneath your feet!*',
        color: Constants.COLORS.GEO,
        emoji: Constants.EMOJIS.Geo,
      };
    }
    case 'electro': {
      return {
        icon: Constants.ICONS.LIGHTENING_BLADE_AETHER,
        name: "Ten'nō of Thunder",
        crown: '*Got Electrocuted?*',
        color: Constants.COLORS.ELECTRO,
        emoji: Constants.EMOJIS.Electro,
      };
    }
    case 'unaligned': {
      return {
        icon: Constants.ICONS.VOID,
        name: 'Arbitrator of Fate',
        crown:
          '*These people are the true & attentive MC Mains...*\n\nThey went extra mile to crown Unaligned Traveler in Archon Quest Chapter 2: Prologue Autumn Winds, Scarlet Leaves\n\n***Never** Question their Hard work, Dedication ~~& Mora..~~*',
        color: Constants.COLORS.UNALIGNED,
        emoji: Constants.EMOJIS.Void,
      };
    }
    default: {
      throw new Error(`Props for ${element} do not exist`);
    }
  }
}
export namespace StaffCheck {
  export function isStaff(member: Member) {
    const roles = member.roles.map((role) => role?.id);
    return roles.some((role) => Constants.STAFF_ARRAY.includes(role));
  }

  export function canGibRole(member: Member) {
    return (
      PermissionTools.checkPermissions(member.permissions, Permissions.MANAGE_ROLES)
      || isStaff(member)
    );
  }

  export async function isCtxStaff(
    ctx: InteractionContext | ComponentContext,
    postEphemeral = false,
  ) {
    if (ctx.member) {
      if (!isStaff(ctx.member) && postEphemeral) {
        await ctx.editOrRespond({
          content: 'Only a mod can use this command',
          flags: MessageFlags.EPHEMERAL,
        });
      }
      return isStaff(ctx.member);
    }
    return false;
  }
}

function nadekoFieldParse(fields: NadekoEmbed['fields']): SimpleEmbed['fields'] {
  const finalFields: SimpleEmbed['fields'] = [];

  fields?.forEach((field) => {
    if (field.name !== '') {
      finalFields.push(field);
    }
  });

  return finalFields;
}

function nadekoEmbedParse(embeds: NadekoContent['embeds']): NadekoParseResult['embeds'] {
  const finalEmbeds: NadekoParseResult['embeds'] = [];

  embeds?.forEach((embed) => {
    const parsedEmbed: SimpleEmbed = {
      author: {
        name: embed.author?.name,
        iconUrl: embed.author?.icon_url,
      },
      color: embed.color
        ? parseInt(embed.color.replace('#', '0x'), 16)
        : Constants.COLORS.EMBED_COLOR,
      description: embed.description,
      footer: {
        text: embed.footer?.text || '\u200b',
        iconUrl: embed.footer?.icon_url,
      },
      image: {
        url: embed.image,
      },
      url: embed.url,
      thumbnail: {
        url: embed.thumbnail,
      },
      title: embed.title,
      fields: nadekoFieldParse(embed.fields),
    };
    finalEmbeds.push(parsedEmbed);
  });

  return finalEmbeds;
}
export function nadekoParse(embedString: string): NadekoParseResult {
  const parsed = JSON.parse(embedString) as NadekoContent;

  return {
    content: parsed.content || ' ',
    embeds: nadekoEmbedParse(parsed.embeds),
  };
}

function getAbyssQuote(): string {
  return randomArrPick(Constants.ABYSS_QUOTES);
}

export function extractLinks(str: string) {
  return str.match(
    // eslint-disable-next-line no-useless-escape
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
  );
}

export function getJoke(category: JokeCategories = 'Any', safeMode = true): Promise<OneJokeFormat> {
  const safeJokeURL = `https://v2.jokeapi.dev/joke/${category}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&safe-mode`;
  const unsafeJokeURL = `https://v2.jokeapi.dev/joke/${category}`;

  return new Promise((resolve, reject) => {
    const jokeURL = safeMode ? safeJokeURL : unsafeJokeURL;

    https.get(jokeURL, (res) => {
      res.on('data', (chunk) => resolve(JSON.parse(chunk.toString())));
      res.on('error', (err) => reject(err));
    });
  });
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  const arrayCopy = [...array];
  while (arrayCopy.length > 0) {
    result.push(arrayCopy.splice(0, size));
  }
  return result;
}

function autoCompleteTech(
  inputVal: string,
  choiceArr: typeof AMC_TECHS['BURST_TECHS'],
): RequestTypes.CreateInteractionResponseInnerPayload['choices'] {
  const values = choiceArr.filter((tech) => tech.name.toLowerCase().includes(inputVal));

  return values.map((tech) => ({
    name: tech.name,
    value: tech.id,
  }));
}

function respondTech(
  inputTechId: string,
  choiceArr: typeof AMC_TECHS['BURST_TECHS'],
): InteractionEditOrRespond {
  const selectedTech = choiceArr.find((tech) => tech.id === inputTechId);
  if (selectedTech !== undefined) {
    return {
      content: `**${selectedTech.name}**\n\n${selectedTech.gif}`,
    };
  }
  return {
    content: `Tech named \`${inputTechId}\` does not exist`,
    flags: MessageFlags.EPHEMERAL,
  };
}

export function viewPages(embeds: SimpleEmbed[]): ComponentActionRow {
  const totalEmbeds = embeds.length;
  let currentIndex = 0;

  const viewRow = new ComponentActionRow()
    .addButton({
      emoji: '⬅️',
      label: 'Previous',
      customId: 'previous',
      style: MessageComponentButtonStyles.SECONDARY,
      /* jscpd:ignore-start */
      async run(btnCtx) {
        if (currentIndex >= 0) {
          currentIndex -= 1;
          await btnCtx.editOrRespond({
            embed: embeds[currentIndex],
            components: [viewRow],
          });
        } else {
          await btnCtx.editOrRespond({
            content: getAbyssQuote(),
            components: [viewRow],
          });
        }
      },
    })
    .addButton({
      emoji: '➡️',
      label: 'Next',
      customId: 'next',
      style: MessageComponentButtonStyles.SECONDARY,
      async run(btnCtx) {
        if (currentIndex < totalEmbeds) {
          currentIndex += 1;
          await btnCtx.editOrRespond({
            embed: embeds[currentIndex],
            components: [viewRow],
          });
        } else {
          await btnCtx.editOrRespond({
            content: getAbyssQuote(),
            components: [viewRow],
          });
        }
      },
      /* jscpd:ignore-end */
    });

  return viewRow;
}

export function travelerCommand(element: ELEMENTS) {
  let selectedProp: TravelerCommandProp;

  switch (element) {
    case 'anemo': {
      selectedProp = AMC_PROPS;
      break;
    }
    case 'geo': {
      selectedProp = GMC_PROPS;
      break;
    }
    case 'electro': {
      selectedProp = EMC_PROPS;
      break;
    }

    default:
      throw new Error(`${element} props do not exist`);
  }

  return new InteractionCommand({
    name: selectedProp.shortName,
    description: `${titleCase(selectedProp.element)} Main Character`,
    global: false,
    guildIds: [EnvConfig.guildId],
    options: [
      {
        name: selectedProp.skill.name,
        description: `${selectedProp.shortName.toUpperCase()} Skill`,
        type: ApplicationCommandOptionTypes.SUB_COMMAND,
        options: [
          {
            name: 'techs',
            description: 'Technologies which power skill',
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
            onAutoComplete(ctx) {
              ctx.respond({
                choices: autoCompleteTech(ctx.value.toLowerCase(), selectedProp.skill.techs),
              });
            },
          },
        ],
        async run(ctx, args: TechArgs) {
          ctx.editOrRespond(respondTech(args.techs!, selectedProp.skill.techs));
        },
      },
      {
        name: selectedProp.burst.name,
        description: `${selectedProp.shortName.toUpperCase()} Burst`,
        type: ApplicationCommandOptionTypes.SUB_COMMAND,
        options: [
          {
            name: 'techs',
            description: 'Technologies which power burst',
            required: true,
            onAutoComplete(ctx) {
              ctx.respond({
                choices: autoCompleteTech(ctx.value.toLowerCase(), selectedProp.burst.techs),
              });
            },
          },
        ],
        async run(ctx, args: TechArgs) {
          ctx.editOrRespond(respondTech(args.techs!, selectedProp.burst.techs));
        },
      },
      {
        name: 'guide',
        description: `Guide on ${selectedProp.shortName.toUpperCase()}`,
        type: ApplicationCommandOptionTypes.SUB_COMMAND,
        async run(ctx) {
          await ctx.editOrRespond({
            content: selectedProp.guide,
          });
        },
      },
    ],
  });
}

export async function getUser(userId: User['id'], SClient = getShardClient()) {
  const user = SClient.users.get(userId) || (await SClient.rest.fetchUser(userId));

  if (!SClient.users.has(userId)) {
    SClient.users.set(user.id, user);
  }

  return user;
}

export async function freezeMuteUser(
  member: Member,
  channel: Channel,
  chance: number,
  duration: number,
  reason: string,
) {
  const pain1 = [Constants.EMOJIS.Aether_Pain1, Constants.EMOJIS.Lumine_Pain1];
  const pain2 = [Constants.EMOJIS.Aether_Pain2, Constants.EMOJIS.Lumine_Pain2];

  const painEmotes = `${randomArrPick(pain1)}${randomArrPick(pain2)}`;

  const RNG = random(0, 100);
  const seconds = duration / (1000 * 60);

  const muteEmbed: SimpleEmbed = {
    color: 0x5f929e,
    title: `${member?.nick || member.username} has been frozen for ${seconds} minute(s)!`,
    description: `${member?.mention} is now temporarily frozen (muted).\n\n**Reason**: ${reason}\n\nPlease use this time to take a break or be productive!`,
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/804253204291387422/895916863345803284/Frozen_Skies.png',
    },
    footer: {
      iconUrl:
        'https://cdn.discordapp.com/icons/803424731474034709/a_ebc29957047bf6244f0b528c2acd7af9.png',
      text: 'For any problems, file a ticket to contact the staff.',
    },
  };
  // console.log({ chance, RNG });
  if (RNG <= chance) {
    member
      .edit({
        communicationDisabledUntil: new Date(Date.now() + duration).toISOString(),
        reason: `${reason} (muted by RNG)`,
      })
      .then(() => {
        channel?.createMessage({
          embed: muteEmbed,
        });
      })
      .catch((err) => {
        Debugging.leafDebug(err, true);
        channel?.createMessage({
          content: `Dammit, I cannot timeout ${
            member.mention
          }. ${painEmotes}\n\nHow about regular mute role? ${randomArrPick([
            Constants.EMOJIS.PaimonThink,
            Constants.EMOJIS.HmmTher,
            Constants.EMOJIS.HmmMine,
            '🤔',
          ])}`,
        });
        member
          .addRole(Constants.ROLE_IDS.OTHERS.FROZEN_RNG, {
            reason: `${reason} (muted by RNG)`,
          })
          .then(() => {
            channel.createMessage({
              content: 'HAHA Take that!',
              embed: muteEmbed,
            });
            setTimeout(() => member.removeRole(Constants.ROLE_IDS.OTHERS.FROZEN_RNG), duration);
          })
          .catch((error) => {
            Debugging.leafDebug(error, true);
            channel?.createMessage({
              content: `Dammit, I cannot even mute by mute role ${painEmotes}`,
            });
          });
      });
  }
}

export function moduleChannelUpdate(
  eventName: string,
  webhookName: string,
  webhookAvatar: Constants.ICONS,
  DBpath: string,
  triggerEvent?: string,
) {
  return new BotEvent({
    event: eventName,
    on: true,
    async listener(newChannel: Channel) {
      let finalWebhook: Webhook;
      try {
        const guildHooks = await newChannel.guild?.fetchWebhooks();
        const pmaHooks = guildHooks?.filter((webhook) => webhook.user?.isMe || false);

        const selectedWebhook = pmaHooks?.find((webhook) => webhook.name === webhookName);

        selectedWebhook?.edit({
          channelId: newChannel.id,
          reason: `${webhookName} webhook channel changed`,
          name: webhookName,
          avatar: webhookAvatar,
        });
        if (!selectedWebhook) {
          throw new Error('No webhooks found');
        } else {
          finalWebhook = selectedWebhook;
        }
      } catch (error) {
        Debugging.leafDebug(error, true);

        finalWebhook = await newChannel.createWebhook({
          name: webhookName,
          avatar: webhookAvatar,
        });
      }
      await db
        .collection(DBpath)
        .doc('webhook')
        .set({
          webhookID: finalWebhook.id,
          channelID: finalWebhook.channelId,
        })
        .then(() => console.log('Webhook details saved in database'));
      if (triggerEvent) {
        PMAEventHandler.emit(triggerEvent, finalWebhook);
      }
    },
  });
}
