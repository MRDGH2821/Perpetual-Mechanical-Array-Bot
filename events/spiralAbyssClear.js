import { Event } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { GuildMember } from 'discord.js';
import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../lib/firebase.cjs';

export default new Event({
  event: 'spiralAbyssClear',

  /**
   * save spiral abyss clear entry to database
   * @function run
   * @param {GuildMember} target - the guild member who cleared abyss
   * @param {boolean} travelerClear - whether cleared with traveler or not
   */
  async run(target, travelerClear) {
    const memberData = await db
        .collection('spiral-abyss-once')
        .doc(target.user.id)
        .get(),
      spiralCurrentData = {
        userID: target.user.id,
        withTraveler: travelerClear
      };
    if (!memberData.exists) {
      const data = {
        date: Timestamp.fromDate(new Date()),
        userID: target.user.id
      };
      await db
        .collection('spiral-abyss-once')
        .doc(`${target.user.id}`)
        .set(data)
        .then(() => console.log('New Spiral Abyss clear added!'))
        .catch((error) => {
          console.log('An error occurred while adding spiral abyss one time clear data');
          console.error(error);
        });
    }

    await db
      .collection('current-spiral-abyss')
      .doc(`${target.user.id}`)
      .set(spiralCurrentData)
      .then(() => console.log('Current spiral abyss data added!'))
      .catch((error) => {
        console.log('An error occurred while adding current spiral abyss clear data');
        console.error(error);
      });
  }
});
