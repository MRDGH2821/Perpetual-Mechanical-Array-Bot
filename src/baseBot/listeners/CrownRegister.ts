import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { ROLE_IDS } from '../../lib/Constants';
import db from '../../lib/Firestore';
import type { CrownRegisterArgs } from '../../typeDefs/typeDefs';
import { PMAEventHandler } from '../lib/Utilities';

@ApplyOptions<ListenerOptions>({
  name: 'CrownRegister',
  emitter: PMAEventHandler,
  event: 'CrownRegister',
  enabled: true,
})
export default class UserEvent extends Listener {
  public async run(args: CrownRegisterArgs) {
    let collectionName = '';
    let { quantity } = args;
    if (quantity > 3 || quantity < 1) {
      throw new Error('Number of crowns must be 1 | 2 | 3. No other quantity is allowed');
    }

    switch (args.crownID) {
      case ROLE_IDS.CROWN.ANEMO: {
        collectionName = 'anemo-crown';
        break;
      }
      case ROLE_IDS.CROWN.GEO: {
        collectionName = 'geo-crown';
        break;
      }
      case ROLE_IDS.CROWN.ELECTRO: {
        collectionName = 'electro-crown';
        break;
      }
      case ROLE_IDS.CROWN.DENDRO: {
        collectionName = 'dendro-crown';
        break;
      }
      case ROLE_IDS.CROWN.UNALIGNED: {
        collectionName = 'unaligned-crown';
        quantity = 1;
        break;
      }
      default: {
        throw new Error(`${args.crownID} is not a valid crown role ID`);
      }
    }
    const crownData = {
      crowns: quantity,
      userID: args.target.id,
    };
    await db
      .collection(collectionName)
      .doc(crownData.userID)
      .set(crownData)
      .then(() => {
        this.container.logger.debug(`Crown data added in ${collectionName}!`);
      })
      .catch(console.debug);
  }
}
