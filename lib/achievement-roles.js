import {
  AbyssalConquerorID,
  AnemoCrownID,
  ElectroCrownID,
  GameKnightID,
  GeoCrownID,
  InazumaReputationID,
  LiyueReputationID,
  MondstadtReputationID,
  NonEleCrownID,
  WhaleID
} from './roleIDs.js';

export const crownRoles = [
    GeoCrownID,
    AnemoCrownID,
    ElectroCrownID
  ],
  explorationRoles = [
    LiyueReputationID,
    InazumaReputationID,
    MondstadtReputationID
  ],
  otherRoles = [
    WhaleID,
    GameKnightID,
    AbyssalConquerorID,
    NonEleCrownID
  ];

/**
 * returns name of region of respective exploration role ID
 * @function exploreName
 * @param {string} exploreID - role ID of exploration role
 * @returns {string} - name of region
 */
export function exploreName(exploreID) {
  let name = '';
  switch (exploreID) {
  case MondstadtReputationID: {
    name = 'Monstadt Exploration';
    break;
  }
  case LiyueReputationID: {
    name = 'Liyue Exploration';
    break;
  }
  case InazumaReputationID: {
    name = 'Inazuma Exploration';
    break;
  }
    // no default
  }
  return name;
}

/**
 * returns name of element of respective crown role ID
 * @function crownName
 * @param {string} crownID - role ID of crown role
 * @returns {string} - name of element
 */
export function crownName(crownID) {
  let name = '';
  switch (crownID) {
  case AnemoCrownID: {
    name = 'anemo-crown';
    break;
  }
  case GeoCrownID: {
    name = 'geo-crown';
    break;
  }
  case ElectroCrownID: {
    name = 'electro-crown';
    break;
  }
  case NonEleCrownID: {
    name = 'unaligned-crown';
    break;
  }
    // no default
  }
  return name;
}
