import type { SpiralAbyssClearTypes } from '../typeDefs/spiralAbyssTypes';

export const SPIRAL_ABYSS_TYPE_CHOICES = [
  {
    name: 'Abyssal Traveler',
    value: 'traveler',
  },
  {
    name: 'Abyssal Conqueror',
    value: 'conqueror',
  },
  {
    name: 'Abyssal Sovereign',
    value: 'sovereign',
  },
] as Array<{ name: string; value: SpiralAbyssClearTypes }>;

export const VALID_ABYSS_CLEAR_TYPES = SPIRAL_ABYSS_TYPE_CHOICES.map((c) => c.value);
