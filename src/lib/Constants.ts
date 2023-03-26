import { Colors, Emoji } from 'discord.js';
import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export enum COLORS {
  EMBED_COLOR = 0xe0d1bd,
  INVISIBLE = 0x2f3136,
  BLURPLE = Colors.Blurple,
  ANEMO = 0x00ffcc,
  GEO = 0xfce200,
  ELECTRO = 0xa500ff,
  UNALIGNED = 0x01152d,
  UNIVERSAL = 0xfffffd,
  ERROR = 0xff0033,
  SUCCESS = 0x00c455,
  SPIRAL_ABYSS = 0x4d00f0,
  DENDRO = 0x94fe00,
}

export enum ICONS {
  ANEMO = 'https://cdn.discordapp.com/emojis/803516622772895764.webp?&quality=lossless',
  GEO = 'https://cdn.discordapp.com/emojis/803516612430135326.webp?&quality=lossless',
  ELECTRO = 'https://cdn.discordapp.com/emojis/803516644923146260.webp?&quality=lossless',
  DENDRO = 'https://cdn.discordapp.com/emojis/803516669984505856.webp?size=128&quality=lossless',
  COPIUM = 'https://cdn.discordapp.com/emojis/897176156057518130.webp?&quality=lossless',
  VOID = 'https://cdn.discordapp.com/emojis/886587673408569394.png?v=1',
  SPIRAL_ABYSS = 'https://cdn.discordapp.com/emojis/806999511096361031.png?v=1',
  CHECK_MARK = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/check-mark-button_2705.png',
  CROSS_MARK = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/cross-mark_274c.png',
  MASANORI = 'https://cdn.discordapp.com/attachments/825749528275189760/954657244157452348/250.png',
  TROPHY = 'https://whatemoji.org/wp-content/uploads/2020/07/Trophy-Emoji.png',
  PALM_VORTEX_AETHER = 'https://cdn.discordapp.com/emojis/840965851199832087.png?v=1',
  STARFELL_SWORD_LUMINE = 'https://cdn.discordapp.com/emojis/840965876370112532.png?v=1',
  LIGHTENING_BLADE_AETHER = 'https://cdn.discordapp.com/attachments/817208583988051999/886635086362071040/ElectroAether3.png',
  RAZOR_GRASS_BLADE_AETHER = 'https://cdn.discordapp.com/emojis/995905335812427846.webp?size=128&quality=lossless',
}

export enum ChannelIds {
  ARCHIVES = '806110144110919730',
  CONFESSIONS = '938763983551356928',
  BOT_SPAM = '804253204291387422',
  COMMAND_CENTER = '803488949254225960',
  MUSIC_BOT_SPAM = '803534858189668372',
  PING_CELESTIA = '841941486034878464',
  SHOWCASE = '876121506680287263',
  ROLE_APPLICATION = '804590144052002817',
  SPIRAL_ABYSS = '804183774589485126',
  LEAKS_DISCUSSION = '803949792349650964',
  RNG_MUTE = '1005733473434206250',
  ARENA_OF_VOTERS = '897042006679883796',
}

export namespace ROLE_IDS {
  export enum OTHERS {
    ARCHONS = '813613841488936971',
    WHALE = '804010525411246140',
    ANOTHER_TEST_SUBJECT = '984388373693210635',
    FROZEN_RNG = '1005767717812449291',
    BATTLE_CASTER = '960210333501358180',
    GLADIATORS = '827536548345806858',
  }

  export enum SpiralAbyss {
    ABYSSAL_TRAVELER = '804225878685908992',
    ABYSSAL_CONQUEROR = '886988485356040242',
    ABYSSAL_SOVEREIGN = '928517469751115786',
  }

  export enum REPUTATION {
    MONDSTADT = '804595515437613077',
    LIYUE = '804595502960214026',
    INAZUMA = '809026481112088596',
    SUMERU = '803429260316508172',
  }
  export enum CROWN {
    ANEMO = '815938264875532298',
    GEO = '816210137613205554',
    ELECTRO = '856509454970781696',
    DENDRO = '947887879084998696',
    UNALIGNED = '859430358419243038',
  }
}

namespace STAFF {
  export enum ADMIN {
    EMERITUS_KNIGHT = '930313822911217674',
    SERVER_ADMIN = '813605549907378186',
  }
  export enum MODS {
    HONORARY_KNIGHT = '803429256758820916',
    GUILD_EMISSARIES = '814338717703471135',
  }
  export enum HELPERS {
    GAME_DIRECTOR = '821571314543624232',
    SERVER_STAFF = '828537737330163732',
    KNIGHT_RECRUIT = '825108492582649877',
    BOT_DEV = '892956048640602122',
  }
}

export const STAFF_ARRAY: string[] = [
  Object.values(STAFF.ADMIN).map(String),
  Object.values(STAFF.HELPERS).map(String),
  Object.values(STAFF.MODS).map(String),
].flat();

export const EMPTY_STRING = '\u200B';

function formatEmoji(
  id: Emoji['id'],
  name: Emoji['name'] = '_',
  animated: Emoji['animated'] = false,
): `<a:${Emoji['name']}:${Emoji['id']}>` | `<:${Emoji['name']}:${Emoji['id']}>` {
  if (animated) {
    return `<a:${name}:${id}>`;
  }
  return `<:${name}:${id}>`;
}

export const EMOJIS = {
  HmmMine: formatEmoji('830243258960838717'),
  HmmTher: formatEmoji('830243224105779290'),
  BoreasKek: formatEmoji('829620211190595605'),
  AetherBonk: formatEmoji('821169357765345291'),
  LuminePadoru: formatEmoji('912033737280192562'),
  PepeKekPoint: formatEmoji('1003564950633054248', 'PepeKekPoint'),
  GoosetherConfuse: formatEmoji('907307618677178368'),
  FakeNooz: formatEmoji('865259265471152138'),
  pepeduck: formatEmoji('907293876073680946'),
  AntiHornyElixir: formatEmoji('810751842883207168'),
  AetherBruh: formatEmoji('813355624796520478'),
  AetherYikes: formatEmoji('810278255336489020'),
  LumineMAD_REEE: formatEmoji('814814997196308491'),
  LuminePanic: formatEmoji('814883112998666241'),
  TarouAngy: formatEmoji('854040153555468329'),
  Anemo: formatEmoji('803516622772895764', 'Anemo'),
  Geo: formatEmoji('803516612430135326', 'Geo'),
  Electro: formatEmoji('803516644923146260', 'Electro'),
  Dendro: formatEmoji('803516669984505856', 'Dendro'),
  Hydro: formatEmoji('803516313782714378', 'Hydro'),
  Pyro: formatEmoji('803516441424822303', 'Pyro'),
  Cryo: formatEmoji('803516632735154177', 'Cryo'),
  Void: formatEmoji('983370274227499050', 'Void'),
  DullBlade: formatEmoji('861628955697741844'),
  DvalinHYPE: formatEmoji('808591175640154142'),
  Copium: formatEmoji('897176156057518130'),
  LumineCopium: formatEmoji('821897404260417557'),
  iLumineati: formatEmoji('1004994499312877598'),
  Pairamid: formatEmoji('1008108212026880050'),
  smh: formatEmoji('866190698676355092'),
  LumineWoke: formatEmoji('809010967786160138'),
  PaimonThink: formatEmoji('853288230694944798'),
  Aether_Pain1: formatEmoji('804189532718759956'),
  Aether_Pain2: formatEmoji('804189554294128650'),
  Lumine_Pain1: formatEmoji('839415679824429098'),
  Lumine_Pain2: formatEmoji('839415680625016832'),
  LumineNice: formatEmoji('822436572736520212', 'LumineNice'),
  Pairasmol: formatEmoji('1010238883872657448', 'Pairasmol'),
  GoldenAranaraSmile: formatEmoji('1024189925811306526', 'GoldenAranaraSmile'),
  GoldenAranaraWave: formatEmoji('1024191817438203944', 'GoldenAranaraWave'),
};

const REP_ROLES = [
  {
    name: 'Megastar in Mondstadt 🚶🌬️',
    value: ROLE_IDS.REPUTATION.MONDSTADT,
  },
  {
    name: 'Illustrious in Inazuma 🚶⛈️',
    value: ROLE_IDS.REPUTATION.INAZUMA,
  },
  {
    name: 'Legend in Liyue 🚶🌏',
    value: ROLE_IDS.REPUTATION.LIYUE,
  },
  {
    name: 'Scholarly in Sumeru 🚶🤓',
    value: ROLE_IDS.REPUTATION.SUMERU,
  },
];

const CROWN_ROLES = [
  {
    name: "Ten'nō of Thunder 👑⛈️",
    value: ROLE_IDS.CROWN.ELECTRO,
  },
  {
    name: 'Jūnzhǔ of Earth 👑🌏',
    value: ROLE_IDS.CROWN.GEO,
  },
  {
    name: 'Herrscher of Wind 👑🌬️',
    value: ROLE_IDS.CROWN.ANEMO,
  },
  {
    name: 'Raja of Evergreens 👑🌲',
    value: ROLE_IDS.CROWN.DENDRO,
  },
  {
    name: 'Arbitrator of Fate 👑',
    value: ROLE_IDS.CROWN.UNALIGNED,
  },
];

const OTHER_ROLES = [
  {
    name: 'Affluent Adventurer 💰',
    value: ROLE_IDS.OTHERS.WHALE,
  },
];

const SPIRAL_ABYSS_ROLES = [
  {
    name: 'Abyssal Traveler 😎',
    value: ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
  },
  {
    name: 'Abyssal Conqueror 🌀',
    value: ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
  },
  {
    name: 'Abyssal Sovereign ⚔️',
    value: ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN,
  },
];

export const ACHIEVEMENT_ROLES = [REP_ROLES, OTHER_ROLES, CROWN_ROLES, SPIRAL_ABYSS_ROLES].flat();
