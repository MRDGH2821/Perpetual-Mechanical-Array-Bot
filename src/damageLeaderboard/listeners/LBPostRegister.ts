import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import type { EmojiIdentifierResolvable } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import LeaderboardCache from '../lib/LeaderboardCache';
import { digitEmoji, leaderboardProps } from '../lib/Utilities';
import type { LBRegistrationArgs } from '../typeDefs/leaderboardTypeDefs';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'LBPostRegister',
  name: 'Leaderboard Registration',
})
export default class LBPostRegister extends Listener {
  public async run(args: LBRegistrationArgs) {
    try {
      await args.proofMessage.react('✅');

      const rank = await LeaderboardCache.getRank(args.contestant.id, args.element, args.groupType);
      const props = leaderboardProps(args.element);

      await args.proofMessage.react(props.emoji).catch(container.logger.error);
      container.logger.debug({ rank });
      if (rank >= 100 || rank < 1) {
        return;
      }

      if (rank >= 1 && rank <= 3) {
        await args.proofMessage.react('⭐');
      }

      if (rank === 1) {
        await args.proofMessage.react('🥇');
        return;
      }

      if (rank === 2) {
        await args.proofMessage.react('🥈');
        return;
      }

      if (rank === 3) {
        await args.proofMessage.react('🥉');
        return;
      }

      const digits = rank.toString().split('');
      container.logger.debug({ rank, digits });
      const digitEmojis = digits.map((digit) => digitEmoji(digit));
      container.logger.debug({ digitEmojis });

      const emojisDone: EmojiIdentifierResolvable[] = [];
      const reactWord = async (emoji: EmojiIdentifierResolvable) => {
        if (emojisDone.includes(emoji)) {
          return args.proofMessage.react('#️⃣');
        }
        container.logger.debug(`Emoji: `, emoji);
        return args.proofMessage.react(emoji.toString()).then((rt) => {
          emojisDone.push(emoji);
          return rt;
        });
      };

      await sequentialPromises(digitEmojis, reactWord).catch(container.logger.error);
      // reactWord(':thinking:');
    } catch (e) {
      container.logger.error(e);
    }
  }
}
