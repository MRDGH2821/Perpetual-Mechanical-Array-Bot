import { IEvent } from '@pma-types/interfaces';
import leaderboardCache from 'lib/leaderboardCache';

const leaderboardRefresh: IEvent = {
  event: 'leaderboardRefresh',
  on: true,
  async listener(LCache: typeof leaderboardCache) {
    process.env.LEADERBOARD = 'false';
    console.log('Leaderboard Refresh Initiated');
  },
};

export default leaderboardRefresh;
