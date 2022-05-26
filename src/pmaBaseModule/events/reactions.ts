import BonkUtilities from '@pma-lib/BonkUtilities';
import { EMOJIS } from '@pma-lib/Constants';
import { leafDebug, randomArrPick } from '@pma-lib/UtilityFunctions';
import { IEvent } from '@pma-types/interfaces';
import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';

const reactions: IEvent = {
  event: ClientEvents.MESSAGE_CREATE,
  async listener(payload: GatewayClientEvents.MessageCreate) {
    const { message } = payload;
    const msg = message.content;

    const bonk = new BonkUtilities();
    bonk.BonkUtilities(msg);

    if (/\b(c+o+o+k+i+e+s*)\b|🍪|🥠/gimu.test(msg)) {
      const cookies = ['🥠', '🍪'];
      await message.react(randomArrPick(cookies));
    }

    if (/\b(r+i+c+e{1,})\b|🍚|🍙|🍘|🎑|🌾/gimu.test(msg)) {
      const rices = ['🍚', '🍙', '🍘', '🎑', '🌾'];

      message.react(randomArrPick(rices));
    }

    if (/\b(s+u+s+h+i{1,})\b|🍣|🍥/gimu.test(msg)) {
      const sushiEmotes = ['🍥', '🍣'];

      await message.react(randomArrPick(sushiEmotes));
    }

    if (/\b(b+r+e+a+d+s*)\b|🍞|🥐|🥖|🥪/gimu.test(msg)) {
      const breads = ['🍞', '🥐', '🥖', '🥪'];
      await message.react(randomArrPick(breads));
    }

    if (/\b(q+u+a+c+k{1,})\b|\b(h+o+n+k{1,})\b|🦆/gimu.test(msg)) {
      const emotes = [
        EMOJIS.AetherNoU,
        EMOJIS.BoreasKek,
        EMOJIS.GoosetherConfuse,
        EMOJIS.FakeNooz,
        EMOJIS.pepeduck,
      ];
      // eslint-disable-next-line prefer-destructuring
      const randomEmote = randomArrPick(emotes).match(/\d+/gm)[0];
      console.log('-------');
      console.log('Before resolving');
      await message.guild
        ?.fetchEmoji(randomEmote)
        .then((resolvedEmote) => {
          console.log(resolvedEmote);

          console.log('-------');

          console.log('After resolving');

          message.react(resolvedEmote.id!).catch(leafDebug);
        })
        .catch(leafDebug);
    }

    if (bonk.isHorny(msg)) {
      const emotes = [
        EMOJIS.AntiHornyElixir,
        EMOJIS.HmmMine,
        EMOJIS.HmmTher,
        EMOJIS.AetherBonk,
        EMOJIS.AetherBruh,
        EMOJIS.AetherYikes,
        EMOJIS.Keqing_No,
        EMOJIS.LumineMAD_REEE,
        EMOJIS.AetherMAD_REEE,
        EMOJIS.LuminePanic,
        EMOJIS.TarouAngy,
      ];

      const randomEmote = randomArrPick(emotes).match(/\d+/gm)[0];

      console.log(randomEmote);
      message.react(randomEmote).catch(leafDebug);
    }

    if (/(yawning|<@!98966314055405568>|<@98966314055405568>)/gimu.test(msg)) {
      const emotes = ['👴', '👑'];

      message.react(randomArrPick(emotes));
    }

    if (
      /(noodle|<@!581430330653671434>|<@581430330653671434>|ramen|noods|<@&826393865275047946>)/gimu.test(
        msg,
      )
    ) {
      const emotes = ['🍜', '🍝'];

      message.react(randomArrPick(emotes));
    }
  },
};

export default reactions;
