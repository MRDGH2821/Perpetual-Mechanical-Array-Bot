import { ApplyOptions } from '@sapphire/decorators';
import { container,Listener,ListenerOptions } from '@sapphire/framework';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';
import { parseDamageCategory,parseGroupType } from '../lib/Utilities';
import type { DBLeaderboardData,LBRegistrationArgs } from '../typeDefs/leaderboardTypeDefs';

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
      })
      .catch(container.logger.error);
  }
}
