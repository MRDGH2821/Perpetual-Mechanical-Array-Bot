import { IEvent } from '@bot-types/interfaces';
import { LeaderboardEntryOptions } from '@bot-types/types';
import db from '@lib/Firestore';

const leaderboardEntry: IEvent = {
  event: 'leaderboardEntry',
  on: true,
  async listener(registration: LeaderboardEntryOptions) {
    console.log('Entry received');
    const collectionName = `${registration.elementCategory}-${registration.typeCategory}`;
    await db
      .collection(collectionName)
      .doc(registration.userID)
      .set(registration)
      .then(() => console.log('Leaderboard Entry Submitted!'))
      .catch((error) => {
        console.log('An error occurred while submitting leaderboard entry');
        console.error(error);
      });
  },
};

export default leaderboardEntry;
