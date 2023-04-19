import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';
import LeaderboardCache from '../lib/LeaderboardCache';
import { digitWord, leaderboardProps, parseDamageCategory, parseGroupType } from '../lib/Utilities';
import type { DBLeaderboardData, LBRegistrationArgs } from '../typeDefs/leaderboardTypeDefs';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'LBRegister',
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
    if (rank >= 100) {
      return;
    }
    const digits = rank.toString().split('');
    const words = digits.map((digit) => digitWord(digit));
    const wordsDone: string[] = [];

    const reactWord = async (word: string) => {
      if (wordsDone.includes(word)) {
        await args.proofMessage.react('#️⃣');
      } else {
        await args.proofMessage.react(word);
        wordsDone.push(word);
      }
    };

    await sequentialPromises(words, reactWord);
  }
}
