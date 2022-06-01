import { CategoryProp, ElementCategories, ELEMENTS } from 'botTypes/types';
import { Permissions } from 'detritus-client/lib/constants';
import { Member } from 'detritus-client/lib/structures';
import { PermissionTools } from 'detritus-client/lib/utils';
import EventEmitter from 'events';
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

export function randomArrPick(array: any[]) {
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

export function categoryProps(dmgCategory: ElementCategories): CategoryProp {
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
}
