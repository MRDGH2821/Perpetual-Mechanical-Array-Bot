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

export enum ChannelIds {
  ARCHIVES = '806110144110919730',
}
