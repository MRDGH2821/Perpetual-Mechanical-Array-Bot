import { COLORS, ICONS, TravelerTypes } from '../lib/Constants';

export type CategoryProp = {
  icon: ICONS;
  name: TravelerTypes;
  skill: string;
  color: COLORS;
};

export type ElementProp = {
  icon: ICONS;
  name: string;
  crown: string;
  color: COLORS;
  emoji: string;
};
