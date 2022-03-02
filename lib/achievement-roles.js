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
