import { CategoryProp, ElementCategories, ELEMENTS } from '@bot-types/types';
import {
  COLORS, ICONS, STAFF_ARRAY, TravelerTypes,
} from '@lib/Constants';
import { Permissions } from 'detritus-client/lib/constants';
import { Member } from 'detritus-client/lib/structures';
import { PermissionTools } from 'detritus-client/lib/utils';
import EventEmitter from 'events';

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

export function randomArrPick(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomSkillIcon(element: ELEMENTS) {
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

export function categoryProps(dmgCategory: ElementCategories): CategoryProp {
  switch (dmgCategory) {
    case 'anemo-dmg-skill': {
      return {
        icon: ICONS.PALM_VORTEX_AETHER,
        name: TravelerTypes.ANEMO,
        skill: 'Palm Vortex - Max storm damage',
        color: COLORS.ANEMO,
      };
    }
    case 'geo-dmg-skill': {
      return {
        icon: ICONS.STARFELL_SWORD_LUMINE,
        name: TravelerTypes.GEO,
        skill: 'Starfell Sword',
        color: COLORS.GEO,
      };
    }
    case 'electro-dmg-skill': {
      return {
        icon: ICONS.LIGHTENING_BLADE_AETHER,
        name: TravelerTypes.ELECTRO,
        skill: 'Lightening Blade',
        color: COLORS.ELECTRO,
      };
    }
    case 'uni-dmg-n5': {
      return {
        icon: ICONS.COPIUM,
        name: TravelerTypes.UNIVERSAL,
        skill: "Traveler's Normal Attack 5th Hit",
        color: COLORS.UNIVERSAL,
      };
    }
    default: {
      return {
        icon: ICONS.VOID,
        name: TravelerTypes.UNALIGNED,
        skill: "Unaligned Traveler's damage",
        color: COLORS.UNALIGNED,
      };
    }
  }
}

export namespace StaffCheck {
  export function isStaff(member: Member) {
    const roles = member.roles.map((role) => role?.id);
    return roles.some((role) => STAFF_ARRAY.includes(role));
  }

  export function canGibRole(member: Member) {
    return (
      PermissionTools.checkPermissions(member.permissions, Permissions.MANAGE_ROLES)
      || isStaff(member)
    );
  }
}
