import { MessageFlags, Permissions } from 'detritus-client/lib/constants';
import { InteractionContext } from 'detritus-client/lib/interaction';
import { Member, User } from 'detritus-client/lib/structures';
import { ComponentContext, PermissionTools } from 'detritus-client/lib/utils';
import { BaseCollection } from 'detritus-utils';
import EventEmitter from 'events';
import https from 'https';
import {
  NadekoContent, NadekoEmbed, NadekoParseResult, SimpleEmbed,
} from '../botTypes/interfaces';
import {
  CategoryProp,
  ElementDamageCategories,
  ElementProp,
  ELEMENTS,
  HallOfFameCacheObject,
  JokeCategories,
  OneJokeFormat,
  SpiralAbyssCacheObject,
} from '../botTypes/types';
import * as Constants from './Constants';

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
        crown: '*Shockwaves underneath your feet!*',
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
          '*These people are the true & attentive MC Mains...*\n\nThey went extra mile to crown Unaligned Traveler in Archon Quest Chapter 2: Prologue Autumn Winds, Scarlet Leaves\n\n***Never** Question their Hardwork, Dedication ~~& Mora..~~*',
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

export function getAbyssQuote(): string {
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

type V = SpiralAbyssCacheObject | HallOfFameCacheObject;

export function constructField<T extends BaseCollection<User['id'], V>, N extends number>(
  collection: T,
  maxLimit: N,
): string {
  let str = '';

  const selected: V[] = collection
    .toArray()
    .sort(() => Math.random() - 0.5)
    .slice(0, maxLimit);

  if (selected.length > 0) {
    selected.forEach((data) => {
      str = `${str}\n${data.user.mention} \`${data.user.tag}\``;
    });
  } else {
    str = `${str}\n*No users found...*`;
  }
  return `${str}\n-`;
}
