import {
  AnemoCrownID,
  ElectroCrownID,
  GeoCrownID,
  NonEleCrownID
} from '../lib/roleIDs.js';
import { Event } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { GuildMember } from 'discord.js';
import { db } from '../lib/firebase.cjs';

export default new Event({
  event: 'spiralAbyssClear',

  /**
   * save spiral abyss clear entry to database
   * @function run
   * @param {GuildMember} target - the guild member who crowned traveler
   * @param {number} crowns - number of crowns
   * @param {string} crownRoleID - the element role
   */
  async run(target, crowns, crownRoleID) {
    const crownData = {
      crowns,
      userID: target.user.id
    };
    let crownName = '';

    if (crownRoleID === AnemoCrownID) {
      crownName = 'anemo-crown';
    }
    else if (crownRoleID === ElectroCrownID) {
      crownName = 'electro-crown';
    }
    else if (crownRoleID === GeoCrownID) {
      crownName = 'geo-crown';
    }
    else if (crownRoleID === NonEleCrownID) {
      crownName = 'unaligned-crown';
    }

    await db
      .collection(`${crownName}`)
      .doc(`${target.user.id}`)
      .set(crownData)
      .then(() => console.log(`${crownName} Crown data added!`))
      .catch((error) => {
        console.log(`An error occurred while adding ${crownName} crown data`);
        console.error(error);
      });
  }
});
