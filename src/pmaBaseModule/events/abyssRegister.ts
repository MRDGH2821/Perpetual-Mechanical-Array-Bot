import { Member } from 'detritus-client/lib/structures';
import { AbyssDBRegisterObject } from '../../botTypes/types';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';

export default new BotEvent({
  event: 'abyssRegister',
  on: true,
  async listener(target: Member, hasClearedWithTraveler: boolean) {
    const spiralCurrentData: AbyssDBRegisterObject = {
      userID: target.user.id,
      withTraveler: hasClearedWithTraveler,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      lunarPhase: new Date().getDate() < 15 ? 'waxing' : 'waning',
    };
    await db
      .collection('spiral-abyss-current')
      .doc(`${target.user.id}`)
      .set(spiralCurrentData)
      .then(() => console.log('Current spiral abyss data added!'))
      .catch((error) => {
        console.log('An error occurred while adding current spiral abyss clear data');
        console.error(error);
      });
  },
});
