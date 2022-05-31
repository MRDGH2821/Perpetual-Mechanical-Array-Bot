import { LeaderboardCacheType } from '@bot-types/types';
import { BaseCollection } from 'detritus-utils';

const leaderboardCache = {
  anemo: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  geo: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  electro: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  dendro: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  hydro: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  pyro: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  cryo: {
    skill: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  unaligned: {
    n5: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
  universal: {
    n5: {
      open: <LeaderboardCacheType> new BaseCollection(),
      solo: <LeaderboardCacheType> new BaseCollection(),
    },
  },
};

export default leaderboardCache;
