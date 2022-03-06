import {
  AetherBonk,
  AetherBruh,
  AetherMAD_REEE,
  AetherNoU,
  AetherYikes,
  AntiHornyElixir,
  BoreasKek,
  FakeNooz,
  GoosetherAlert,
  GoosetherConfuse,
  HmmMine,
  HmmTher,
  Keqing_No,
  LumineMAD_REEE,
  LuminePanic,
  QuackStab,
  TarouAngy,
  goose,
  goose_pizza,
  goose_stab,
  gooserun,
  pepeduck
} from '../lib/emoteIDs.js';
import Bonk from '../lib/bonk-utilities.js';
import { Event } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { Message } from 'discord.js';
import { pickRandom } from 'mathjs';

export default new Event({
  event: 'messageCreate',

  /**
   * message create event
   * @async
   * @function run
   * @param {Message} message - message object
   */
  async run(message) {
    const bonk = new Bonk(message.content),
      msg = message.content;
    try {
      if ((/\b(c+o+o+k+i+e+s*)\b|🍪|🥠/gimu).test(msg)) {
        const cookies = [
          '🥠',
          '🍪'
        ];
        await message.react(pickRandom(cookies));
      }

      if ((/\b(r+i+c+e{1,})\b|🍚|🍙|🍘|🎑|🌾/gimu).test(msg)) {
        const rices = [
          '🍚',
          '🍙',
          '🍘',
          '🎑',
          '🌾'
        ];

        message.react(pickRandom(rices));
      }

      if ((/\b(s+u+s+h+i{1,})\b|🍣|🍥/gimu).test(msg)) {
        const sushiEmotes = [
          '🍥',
          '🍣'
        ];

        await message.react(pickRandom(sushiEmotes));
      }

      if ((/\b(b+r+e+a+d+s*)\b|🍞|🥐|🥖|🥪/gimu).test(msg)) {
        const breads = [
          '🍞',
          '🥐',
          '🥖',
          '🥪'
        ];
        await message.react(pickRandom(breads));
      }

      if ((/\b(q+u+a+c+k{1,})\b|\b(h+o+n+k{1,})\b|🦆/gimu).test(msg)) {
        const emotes = [
            AetherNoU,
            BoreasKek,
            GoosetherConfuse,
            FakeNooz,
            pepeduck,
            goose,
            goose_pizza,
            goose_stab,
            gooserun,
            GoosetherConfuse,
            GoosetherAlert,
            QuackStab
          ],
          // eslint-disable-next-line prefer-destructuring
          randomEmote = pickRandom(emotes).match(/\d{1,}/gimu)[0];

        // console.log(randomEmote);
        message.react(randomEmote).catch(console.error);
      }

      if (bonk.isHorny(msg)) {
        const emotes = [
            AntiHornyElixir,
            HmmMine,
            HmmTher,
            AetherBonk,
            AetherBruh,
            AetherYikes,
            Keqing_No,
            LumineMAD_REEE,
            AetherMAD_REEE,
            LuminePanic,
            TarouAngy
          ],
          // eslint-disable-next-line prefer-destructuring
          randomEmote = pickRandom(emotes).match(/\d{1,}/gimu)[0];

        // console.log(randomEmote);
        message.react(randomEmote).catch(console.error);
      }

      if (
        (/(yawning|<@!98966314055405568>|<@98966314055405568>)/gimu).test(msg)
      ) {
        const emotes = [
          '👴',
          '👑'
        ];

        message.react(pickRandom(emotes));
      }

      if (
        (/(noodle|<@!581430330653671434>|<@581430330653671434>|ramen|noods|<@&826393865275047946>)/gimu).test(msg)
      ) {
        const emotes = [
          '🍜',
          '🍝'
        ];

        message.react(pickRandom(emotes));
      }
    }
    catch (error) {
      console.error(error);
    }
  }
});
