import { CHANNEL_IDS, ICONS } from '@pma-lib/Constants';
import EventEmitter from 'events';

export function debug(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function leafDebug(obj: any) {
  console.log(debug(obj));
}

export function isLeaderboardLink(link: string) {
  leafDebug(link.match(CHANNEL_IDS.SHOWCASE));
  return link.match(CHANNEL_IDS.SHOWCASE)!.length > 0;

  // return /876121506680287263/gm.test(link);
}

export function randomArrPick(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomSkillIcon(
  element: 'anemo' | 'geo' | 'electro' | 'dendro' | 'hydro' | 'pyro' | 'cryo',
) {
  switch (element) {
    case 'anemo': {
      const icons = [ICONS.ANEMO, ICONS.PALM_VORTEX_AETHER];
      return randomArrPick(icons);
    }
    case 'geo': {
      const icons = [ICONS.GEO, ICONS.STARFELL_SWORD_LUMINE];
      return randomArrPick(icons);
    }
    case 'electro': {
      const icons = [ICONS.ELECTRO, ICONS.LIGHTENING_BLADE_AETHER];
      return randomArrPick(icons);
    }
    default: {
      const icons = [ICONS.VOID, ICONS.COPIUM];
      return randomArrPick(icons);
    }
  }
}

export const PMAEventHandler = new EventEmitter();
