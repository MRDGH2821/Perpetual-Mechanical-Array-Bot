import { Member } from 'detritus-client/lib/structures';
import { CrownDBRegisterObject } from '../../botTypes/types';
import BotEvent from '../../lib/BotEvent';
import { ROLE_IDS } from '../../lib/Constants';
import db from '../../lib/Firestore';

export default new BotEvent({
  event: 'crownRegister',
  on: true,
  async listener(
    target: Member,
    crownArgs: {
      quantity: 1 | 2 | 3;
      crownID: ROLE_IDS.CROWN;
    },
  ) {
    let collectionName = '';

    switch (crownArgs.crownID) {
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
        break;
      }
      default: {
        throw new Error(`${crownArgs.crownID} is not a valid crown role ID`);
      }
    }

    const crownData: CrownDBRegisterObject = {
      crowns: crownArgs.quantity,
      userID: target.user.id,
    };

    await db
      .collection(collectionName)
      .doc(`${target.user.id}`)
      .set(crownData)
      .then(() => console.log(`${collectionName} Crown data added!`))
      .catch((error) => {
        console.log(`An error occurred while adding ${collectionName} crown data`);
        console.error(error);
      });
  },
});
