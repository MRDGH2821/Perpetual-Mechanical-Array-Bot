import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import type { EmojiIdentifierResolvable } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';
import LeaderboardCache from '../lib/LeaderboardCache';
import {
  digitEmoji,
  leaderboardProps,
  parseDamageCategory,
  parseGroupType,
} from '../lib/Utilities';
import type { DBLeaderboardData, LBRegistrationArgs } from '../typeDefs/leaderboardTypeDefs';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'LBPostRegister',
  name: 'Leaderboard Registration',
})
export default class LBRegister extends Listener {
  public async run(args: LBRegistrationArgs) {
    const dbData: DBLeaderboardData = {
      elementCategory: parseDamageCategory(args.element),
      proof: args.proofMessage.url,
      score: args.score,
      typeCategory: parseGroupType(args.groupType),
      userID: args.contestant.id,
    };

    await db
      .collection(`${dbData.elementCategory}-${dbData.typeCategory}`)
      .doc(dbData.userID)
      .set(dbData)
      .then(() => {
        container.logger.debug('Leaderboard Entry Submitted!');
        this.postRegistration(args);
      })
      .catch(container.logger.error);
  }

  // eslint-disable-next-line class-methods-use-this
  public async postRegistration(args: LBRegistrationArgs) {
    await args.proofMessage.react('✅');

    const rank = await LeaderboardCache.getRank(args.contestant.id, args.element, args.groupType);
    const props = leaderboardProps(args.element);

    await args.proofMessage.react(props.emoji);
    if (rank >= 100 || rank < 1) {
      return;
    }
    const digits = rank.toString().split('');
    container.logger.debug({ rank, digits });
    const digitEmojis = digits.map((digit) => digitEmoji(digit));
    const emojisDone: EmojiIdentifierResolvable[] = [];

    const reactWord = async (emoji: EmojiIdentifierResolvable) => {
      if (emojisDone.includes(emoji)) {
        await args.proofMessage.react('#️⃣');
      } else {
        await args.proofMessage.react(emoji);
        emojisDone.push(emoji);
      }
    };

    await sequentialPromises(digitEmojis, reactWord);
  }
}
