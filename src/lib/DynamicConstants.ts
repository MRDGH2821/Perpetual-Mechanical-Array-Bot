import QuotesManager from '../baseBot/lib/QuotesManager';
import type { DBQuotes } from '../typeDefs/typeDefs';

export const ABYSS_QUOTES = ['*Well.. thats it folks!*']
  .concat(QuotesManager.getQuotes('abyssGifs'), QuotesManager.getQuotes('abyssQuotes'))
  .flat();
export const QUOTE_CATEGORIES: DBQuotes[] = [
  'FBIGifs',
  'FBIQuotes',
  'RNGMuteQuotes',
  'RNGMuteReasons',
  'TikTokGifs',
  'TikTokQuotes',
  'abyssGifs',
  'abyssQuotes',
  'banHammerReasons',
  'bonkGifs',
  'crowdSourcedBonkReasons',
  'crowdSourcedHornyBonkReasons',
  'hornyBonkGifs',
  'leakQuotes',
  'leaksMuteReasons',
  'selfHornyBonkGifs',
  'yoyoverseQuotes',
];
