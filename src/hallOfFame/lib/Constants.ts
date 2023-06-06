import type { ELEMENTS } from '../../typeDefs/typeDefs';

export const HALL_OF_FAME_ELEMENT_CHOICES = <{ name: string; value: ELEMENTS }[]>[
  {
    name: 'Herrscher of Wind (Anemo)',
    value: 'anemo',
  },
  {
    name: 'Jūnzhǔ of Earth (Geo)',
    value: 'geo',
  },
  {
    name: "Ten'nō of Thunder (Electro)",
    value: 'electro',
  },
  {
    name: 'Raja of Evergreens (Dendro)',
    value: 'dendro',
  },
  {
    name: 'Arbitrator of Fate (Unaligned)',
    value: 'unaligned',
  },
];

export const RELEASED_ELEMENTS: ELEMENTS[] = ['anemo', 'geo', 'electro', 'dendro', 'unaligned'];
