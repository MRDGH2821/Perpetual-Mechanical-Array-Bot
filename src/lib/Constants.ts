import { Colors } from 'discord.js';
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
}
