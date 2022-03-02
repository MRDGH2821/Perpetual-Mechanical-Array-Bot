import { Event } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { GuildMember } from 'discord.js';
import { NonEleCrownID } from '../lib/roleIDs.js';
import { crownName } from '../lib/achievement-roles.js';
import { db } from '../lib/firebase.cjs';

export default new Event({
  event: 'travelerCrown',

  /**
   * save spiral abyss clear entry to database
   * @async
   * @function run
   * @param {GuildMember} target - the guild member who crowned traveler
   * @param {Object} crownOption - crown options
   * @param {number} crownOption.crowns - number of crowns
   * @param {string} crownOption.crownRoleID - the element role
   */
  async run(target, { crowns, crownRoleID }) {
    console.log('Crown ID: ', crownRoleID);

    const crownData = {
        crowns,
        userID: target.user.id
      },
      crownname = crownName(crownRoleID);
    console.log('Crown name before: ', crownname);

    if (crownRoleID === NonEleCrownID) {
      crownData.crowns = 1;
    }

    console.log('Crown name after:', crownname);

    await db
      .collection(`${crownname}`)
      .doc(`${target.user.id}`)
      .set(crownData)
      .then(() => console.log(`${crownname} Crown data added!`))
      .catch((error) => {
        console.log(`An error occurred while adding ${crownname} crown data`);
        console.error(error);
      });
  }
});
