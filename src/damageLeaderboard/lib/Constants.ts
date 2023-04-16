import type { LBElements } from '../typeDefs/leaderboardTypeDefs';

export const LEADERBOARD_DAMAGE_TYPE_CHOICES = <{ name: string; value: LBElements }[]>[
  {
    name: "Traveler's Normal Attack 5th hit",
    value: 'uni',
  },
  {
    name: 'Palm Vortex - Max storm damage',
    value: 'anemo',
  },
  {
    name: 'Starfell Sword',
    value: 'geo',
  },
  {
    name: 'Lightening Blade',
    value: 'electro',
  },
  {
    name: 'Razor grass Blade',
    value: 'dendro',
  },
];

export const LEADERBOARD_ELEMENTS: LBElements[] = ['anemo', 'geo', 'electro', 'dendro', 'uni'];
