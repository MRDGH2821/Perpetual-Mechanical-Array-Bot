export type ElementDamageCategories =
  | 'anemo-dmg-skill'
  | 'geo-dmg-skill'
  | 'electro-dmg-skill'
  | 'dendro-dmg-skill'
  | 'uni-dmg-n5';

export type SkillElements = 'anemo' | 'geo' | 'electro' | 'dendro';

export type N5Elements = 'uni';

export type LBElements = SkillElements | N5Elements;
