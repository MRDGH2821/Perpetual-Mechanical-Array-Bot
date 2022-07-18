import { parse } from 'mathjs';

const anemoMotionValues = {
  skill: {
    press: {
      tl1: { anemo: 1.76 },
      tl2: { anemo: 1.892 },
      tl3: { anemo: 2.024 },
      tl4: { anemo: 2.2 },
      tl5: { anemo: 2.332 },
      tl6: { anemo: 2.464 },
      tl7: { anemo: 2.64 },
      tl8: { anemo: 2.816 },
      tl9: { anemo: 2.992 },
      tl10: { anemo: 3.168 },
      tl11: { anemo: 3.344 },
      tl12: { anemo: 3.52 },
      tl13: { anemo: 3.74 },
    },
    hold: {
      tl1: {
        anemo: 2.832,
        absorbed: 0.678,
        initialCut2x: 0.12,
        maxCut4x: 0.168,
        maxStorm1x: 1.92,
        initialCutAbsorbed1x: 0.03,
        maxCutAbsorbed4x: 0.042,
        maxStormAbsorbed1x: 0.48,
      },
      tl2: {
        anemo: 3.044,
        absorbed: 0.7289,
        initialCut2x: 0.129,
        maxCut4x: 0.1806,
        maxStorm1x: 2.064,
        initialCutAbsorbed1x: 0.0323,
        maxCutAbsorbed4x: 0.0452,
        maxStormAbsorbed1x: 0.516,
      },
      tl3: {
        anemo: 3.257,
        absorbed: 0.7797,
        initialCut2x: 0.138,
        maxCut4x: 0.1932,
        maxStorm1x: 2.208,
        initialCutAbsorbed1x: 0.0345,
        maxCutAbsorbed4x: 0.0483,
        maxStormAbsorbed1x: 0.552,
      },
      tl4: {
        anemo: 3.54,
        absorbed: 0.8475,
        initialCut2x: 0.15,
        maxCut4x: 0.21,
        maxStorm1x: 2.4,
        initialCutAbsorbed1x: 0.0375,
        maxCutAbsorbed4x: 0.0525,
        maxStormAbsorbed1x: 0.6,
      },
      tl5: {
        anemo: 3.752,
        absorbed: 0.8984,
        initialCut2x: 0.159,
        maxCut4x: 0.2226,
        maxStorm1x: 2.544,
        initialCutAbsorbed1x: 0.0398,
        maxCutAbsorbed4x: 0.0557,
        maxStormAbsorbed1x: 0.636,
      },
      tl6: {
        anemo: 3.965,
        absorbed: 0.9492,
        initialCut2x: 0.168,
        maxCut4x: 0.2352,
        maxStorm1x: 2.688,
        initialCutAbsorbed1x: 0.042,
        maxCutAbsorbed4x: 0.0588,
        maxStormAbsorbed1x: 0.672,
      },
      tl7: {
        anemo: 4.248,
        absorbed: 1.017,
        initialCut2x: 0.18,
        maxCut4x: 0.252,
        maxStorm1x: 2.88,
        initialCutAbsorbed1x: 0.045,
        maxCutAbsorbed4x: 0.063,
        maxStormAbsorbed1x: 0.72,
      },
      tl8: {
        anemo: 4.531,
        absorbed: 1.0848,
        initialCut2x: 0.192,
        maxCut4x: 0.2688,
        maxStorm1x: 3.072,
        initialCutAbsorbed1x: 0.048,
        maxCutAbsorbed4x: 0.0672,
        maxStormAbsorbed1x: 0.768,
      },
      tl9: {
        anemo: 4.814,
        absorbed: 1.1526,
        initialCut2x: 0.204,
        maxCut4x: 0.2856,
        maxStorm1x: 3.264,
        initialCutAbsorbed1x: 0.051,
        maxCutAbsorbed4x: 0.0714,
        maxStormAbsorbed1x: 0.816,
      },
      tl10: {
        anemo: 5.098,
        absorbed: 1.2204,
        initialCut2x: 0.216,
        maxCut4x: 0.3024,
        maxStorm1x: 3.456,
        initialCutAbsorbed1x: 0.054,
        maxCutAbsorbed4x: 0.0756,
        maxStormAbsorbed1x: 0.864,
      },
      tl11: {
        anemo: 5.381,
        absorbed: 1.2882,
        initialCut2x: 0.228,
        maxCut4x: 0.3192,
        maxStorm1x: 3.648,
        initialCutAbsorbed1x: 0.057,
        maxCutAbsorbed4x: 0.0798,
        maxStormAbsorbed1x: 0.912,
      },
      tl12: {
        anemo: 5.664,
        absorbed: 1.356,
        initialCut2x: 0.24,
        maxCut4x: 0.336,
        maxStorm1x: 3.84,
        initialCutAbsorbed1x: 0.06,
        maxCutAbsorbed4x: 0.084,
        maxStormAbsorbed1x: 0.96,
      },
      tl13: {
        anemo: 6.018,
        absorbed: 1.4408,
        initialCut2x: 0.255,
        maxCut4x: 0.357,
        maxStorm1x: 4.08,
        initialCutAbsorbed1x: 0.0638,
        maxCutAbsorbed4x: 0.0893,
        maxStormAbsorbed1x: 1.02,
      },
    },
  },
  burst: {
    tl1: {
      anemo: 7.272,
      absorbed: 2.232,
      tornado9x: 0.808,
      absorbed9x: 0.248,
    },
    tl2: {
      anemo: 7.8174,
      absorbed: 2.3994,
      tornado9x: 0.8686,
      absorbed9x: 0.2666,
    },
    tl3: {
      anemo: 8.3655,
      absorbed: 2.5668,
      tornado9x: 0.9295,
      absorbed9x: 0.2852,
    },
    tl4: {
      anemo: 9.09,
      absorbed: 2.79,
      tornado9x: 1.01,
      absorbed9x: 0.31,
    },
    tl5: {
      anemo: 9.6354,
      absorbed: 2.9574,
      tornado9x: 1.0706,
      absorbed9x: 0.3286,
    },
    tl6: {
      anemo: 10.1808,
      absorbed: 3.1248,
      tornado9x: 1.1312,
      absorbed9x: 0.3472,
    },
    tl7: {
      anemo: 10.908,
      absorbed: 3.348,
      tornado9x: 1.212,
      absorbed9x: 0.372,
    },
    tl8: {
      anemo: 11.6352,
      absorbed: 3.5712,
      tornado9x: 1.2928,
      absorbed9x: 0.3968,
    },
    tl9: {
      anemo: 12.3624,
      absorbed: 3.7944,
      tornado9x: 1.3736,
      absorbed9x: 0.4216,
    },
    tl10: {
      anemo: 13.0896,
      absorbed: 4.0176,
      tornado9x: 1.4544,
      absorbed9x: 0.4464,
    },
    tl11: {
      anemo: 13.8168,
      absorbed: 4.2408,
      tornado9x: 1.5352,
      absorbed9x: 0.4712,
    },
    tl12: {
      anemo: 14.544,
      absorbed: 4.464,
      tornado9x: 1.616,
      absorbed9x: 0.496,
    },
    tl13: {
      anemo: 15.453,
      absorbed: 4.743,
      tornado9x: 1.717,
      absorbed9x: 0.527,
    },
  },
};

namespace anemoDmgFormulas {
  export const pressSkill = {
    nonCrit: parse(
      '((anemoMV * atk) * 1.466 * (190/390) * 0.9) + (1.2 * (1 + (16 * em) / (2000 + em)) * 725.36 * 0.9)',
    ).compile(),
    crit: parse(
      '((anemoMV * atk) * 1.466 * (1 + cd) * (190/390) * 0.9) + (1.2 * (1 + (16 * em) / (2000 + em) + 0.6) * 725.36 * 0.9)',
    ).compile(),
    average: parse(
      '((anemoMV * Total ATK) * 1.466 * (1 + cr * cd) * (190/390) * 0.9) + (1.2 * (1 + (16 * em) / (2000 + em) + 0.6) * 725.36 * 0.9)',
    ).compile(),
  };
  export const holdSkill = {
    nonCrit: parse(
      '((anemoMV * atk) * 1.466 * (190/390) * 0.9) + ((absorbedMV * atk) * (190/390) * 0.9) + ((1.2 * (1 + (16 * em) / (2000 + em)) * 725.36 * 0.9) * 3)',
    ).compile(),
    crit: parse(
      '((anemoMV * atk) * 1.466 * (1 + cd) * (190/390) * 0.9) + ((absorbedMV * atk) * (1 + cd) * (190/390) * 0.9) + ((1.2 * (1 + (16 * em) / (2000 + em) + 0.6) * 725.36 * 0.9) * 3)',
    ).compile(),
    average: parse(
      '((anemoMV * atk) * 1.466 * (1 + cr * cd) * (190/390) * 0.9)  + ((absorbedMV * atk) * (1 + cr * cd) * (190/390) * 0.9) + ((1.2 * (1 + (16 * em) / (2000 + em) + 0.6) * 725.36 * 0.9) * 3)',
    ).compile(),
  };

  export const burst = holdSkill;
}

function calculateAnemoPressSkill(atk: number, cr: number, cd: number, tl: number, em: number) {
  const talentLvl = `tl${tl}`;

  const formula = anemoDmgFormulas.pressSkill;

  const scope = {
    anemoMV: anemoMotionValues.skill.press[talentLvl].anemo,
    atk,
    em,
    cr,
    cd,
  };

  return {
    average: formula.average.evaluate(scope),
    crit: formula.crit.evaluate(scope),
    nonCrit: formula.nonCrit.evaluate(scope),
  };
}

function calculateAnemoHoldSkill(atk: number, cr: number, cd: number, tl: number, em: number) {
  const talentLvl = `tl${tl}`;

  const formula = anemoDmgFormulas.holdSkill;

  const scope = {
    anemoMV: anemoMotionValues.skill.hold[talentLvl].anemo,
    atk,
    em,
    cr,
    cd,
    absorbedMV: anemoMotionValues.skill.hold[talentLvl].absorbed,
  };

  return {
    average: formula.average.evaluate(scope),
    crit: formula.crit.evaluate(scope),
    nonCrit: formula.nonCrit.evaluate(scope),
  };
}

export function calculateAnemo(atk: number, cr: number, cd: number, tl: number, em: number) {
  return {
    skill: {
      press: calculateAnemoPressSkill(atk, cr, cd, tl, em),
      hold: calculateAnemoHoldSkill(atk, cr, cd, tl, em),
    },
  };
}
