import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import BonkUtilities from '../../lib/BonkUtilities';
import BotEvent from '../../lib/BotEvent';
import { EMOJIS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { Debugging, randomArrPick } from '../../lib/Utilities';

export default new BotEvent({
  event: ClientEvents.MESSAGE_CREATE,
  async listener(payload: GatewayClientEvents.MessageCreate) {
    const { message } = payload;
    const msg = message.content;

    const bonk = new BonkUtilities(msg);

    function reactEmoji(emoji: string) {
      try {
        if (Object.values(EMOJIS).includes(emoji)) {
          const resolvedEmote = message.client.emojis.get(
            EnvConfig.guildId,
            emoji.match(/\d+/gm)![0],
          );
          message.react(`${resolvedEmote?.name}: ${resolvedEmote?.id}`).catch((err) => {
            Debugging.leafDebug(err, true);
          });
        } else {
          message.react(emoji).catch((err) => {
            Debugging.leafDebug(err, true);
          });
        }
      } catch (err) {
        Debugging.leafDebug(err, true);
      }
    }

    if (/\b(c+o+o+k+i+e+s*)\b|🍪|🥠/gimu.test(msg)) {
      const cookies = ['🥠', '🍪'];
      reactEmoji(randomArrPick(cookies));
    }

    if (/\b(r+i+c+e{1,})\b|🍚|🍙|🍘|🎑|🌾/gimu.test(msg)) {
      const rices = ['🍚', '🍙', '🍘', '🎑', '🌾'];

      reactEmoji(randomArrPick(rices));
    }

    if (/\b(s+u+s+h+i{1,})\b|🍣|🍥/gimu.test(msg)) {
      const sushiEmotes = ['🍥', '🍣'];

      reactEmoji(randomArrPick(sushiEmotes));
    }

    if (/\b(b+r+e+a+d+s*)\b|🍞|🥐|🥖|🥪/gimu.test(msg)) {
      const breads = ['🍞', '🥐', '🥖', '🥪'];
      reactEmoji(randomArrPick(breads));
    }

    if (/\b(q+u+a+c+k{1,})\b|\b(h+o+n+k{1,})\b|🦆/gimu.test(msg)) {
      const emotes = [
        EMOJIS.AetherNoU,
        EMOJIS.BoreasKek,
        EMOJIS.GoosetherConfuse,
        EMOJIS.FakeNooz,
        EMOJIS.pepeduck,
        '🦆',
      ];

      reactEmoji(randomArrPick(emotes));
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
        '🔞',
      ];

      reactEmoji(randomArrPick(emotes));
    }

    if (/(yawning|<@!98966314055405568>|<@98966314055405568>)/gimu.test(msg)) {
      const emotes = ['👴', '👑', '🐋', '🐳'];

      reactEmoji(randomArrPick(emotes));
    }

    if (
      /(noodle|<@!581430330653671434>|<@581430330653671434>|ramen|noods|<@&826393865275047946>)/gimu.test(
        msg,
      )
    ) {
      const emotes = ['🍜', '🍝', '👶', '🍼', '🐤', '🚼', '👨‍🍼', '🧑‍🍼', '👩‍🍼'];

      reactEmoji(randomArrPick(emotes));
    }

    if (/(<@263408665539641344>)/gimu.test(msg)) {
      const emotes = ['💀', '☠️', '🦴'];

      reactEmoji(randomArrPick(emotes));
    }
  },
});
