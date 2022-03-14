import { Event } from '@ruinguard/core';
import { db } from '../lib/firebase.cjs';
import { leaderboardGenerate } from '../lib/LeaderboardManager.js';

export default new Event({
  event: 'leaderboardUpdate',

  async run(client) {
    const anemoSkillBoard = await leaderboardGenerate(
        client,
        'anemo-dmg-skill'
      ),
      electroSkillBoard = await leaderboardGenerate(
        client,
        'electro-dmg-skill'
      ),
      geoSkillBoard = await leaderboardGenerate(client, 'geo-dmg-skill'),
      uniN5board = await leaderboardGenerate(client, 'uni-dmg-n5'),

      leaderboardDB = await db.collection('leaderboards');
  }
});
