import { Event, CooldownManager } from '@ruinguard/core';
import Bonk from '../auto-reply/bonk.js';
const icd = new CooldownManager();
icd.add('bonkCD', 0);

export default new Event({
  event: 'messageCreate',
  async run(message) {
    const bonk = new Bonk(message);
    // console.log(message.content);
    if (bonk.isHorny()) {
      const timeLeft = await icd.check('bonkCD');
      console.log('ICD: ', timeLeft);
      if (timeLeft < 1 || timeLeft === false) {
        await bonk.hornyBonk();
        await icd.add('bonkCD', 60000);
      } else {
        console.log('Reached else part, Bonk CD: ', await icd.check('bonkCD'));
      }
    }
  },
});
