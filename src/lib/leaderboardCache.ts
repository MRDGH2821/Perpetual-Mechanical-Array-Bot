import { LeaderboardEntryOptions } from '@pma-types/interfaces';
import { User } from 'detritus-client/lib/structures';
import { BaseCollection } from 'detritus-utils';

const leaderboardCache = {
  anemo: {
    skill: {
      open: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
      solo: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
    },
  },
  geo: {
    skill: {
      open: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
      solo: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
    },
  },
  electro: {
    skill: {
      open: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
      solo: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
    },
  },
  universal: {
    n5: {
      open: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
      solo: new BaseCollection<User['id'], { user: User; data: LeaderboardEntryOptions }>(),
    },
  },
};

export default leaderboardCache;
