import type { LBElements } from '../typeDefs/leaderboardTypeDefs';

export const LEADERBOARD_DAMAGE_TYPE_CHOICES = <{ name: string; value: LBElements }[]>[
  {
    name: "Universal: Traveler's Normal Attack 5th hit",
    value: 'uni',
  },
  {
    name: 'Anemo: Palm Vortex - Max Storm damage',
    value: 'anemo',
  },
  {
    name: 'Geo: Starfell Sword',
    value: 'geo',
  },
  {
    name: 'Electro: Lightning Blade',
    value: 'electro',
  },
  {
    name: 'Dendro: Razorgrass Blade',
    value: 'dendro',
  },
];

export const LEADERBOARD_ELEMENTS: LBElements[] = ['anemo', 'geo', 'electro', 'dendro', 'uni'];
