import { Colors, Snowflake } from 'detritus-client/lib/constants';

function formatEmoji(EmojiSnowflake: Snowflake) {
  return `<:_:${EmojiSnowflake}>`;
}

export const COLORS = {
  EMBED_COLOR: 0xe0d1bd,
  INVISIBLE: 0x2f3136,
  BLURPLE: Colors.BLURPLE,
};

export const EMOJIS = {
  HmmMine: formatEmoji('830243258960838717'),
  HmmTher: formatEmoji('830243224105779290'),
  BoreasKek: formatEmoji('829620211190595605'),
  AetherBonk: formatEmoji('821169357765345291'),
  LuminePadoru: formatEmoji('912033737280192562'),
  PepeKekPoint: formatEmoji('849624262625198131'),
};

export const CHANNEL_IDS = {
  ARCHIVES: '806110144110919730',
  CONFESSIONS: '938763983551356928',
  BOT_SPAM: '804253204291387422',
  COMMAND_CENTER: '803488949254225960',
  MUSIC_BOT_SPAM: '803534858189668372',
  PING_CELESTIA: '841941486034878464',
};

export const STAFF = {
  ADMIN: {
    EMERITUS_KNIGHT: '930313822911217674',
    SERVER_ADMIN: '813605549907378186',
  },
  MODS: {
    HONORARY_KNIGHT: '803429256758820916',
    GUILD_EMISSARIES: '814338717703471135',
  },
  HELPERS: {
    GAME_DIRECTOR: '821571314543624232',
    SERVER_STAFF: '828537737330163732',
    KNIGHT_RECRUIT: '825108492582649877',
  },
};

export const STAFF_ARRAY = [
  ...Object.values(STAFF.ADMIN),
  ...Object.values(STAFF.HELPERS),
  ...Object.values(STAFF.MODS),
];

export const ROLE_IDS = {
  ARCHONS: '813613841488936971',
  REPUTATION: {
    MONDSTADT: '804595515437613077',
    LIYUE: '804595502960214026',
    INAZUMA: '809026481112088596',
  },
  ABYSSAL_CONQUEROR: '804225878685908992',
  CROWN: {
    ANEMO: '815938264875532298',
    GEO: '816210137613205554',
    ELECTRO: '856509454970781696',
    NON_ELE: '859430358419243038',
  },
  WHALE: '804010525411246140',
  STAFF,
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
    name: 'Arbitrator of Fate 👑',
    value: ROLE_IDS.CROWN.NON_ELE,
  },
];

const OTHER_ROLES = [
  {
    name: 'Affluent Adventurer 💰',
    value: ROLE_IDS.WHALE,
  },
  {
    name: 'Abyssal Conqueror 🌀',
    value: ROLE_IDS.ABYSSAL_CONQUEROR,
  },
];

export const ACH_ROLES = REP_ROLES.concat(OTHER_ROLES, CROWN_ROLES);
