import { Event } from '@ruinguard/core';
import Bonk from '../auto-reply/bonk.js';

export default new Event({
  event: 'messageCreate',
  async run(message) {
    const bonk = new Bonk(message);
    console.log(message.content);
    await bonk.hornyBonk();
  },
});
