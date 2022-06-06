import { ShardClient } from 'detritus-client';
import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { showcaseLeaderboardGenerate } from '../../lib/leaderboardCacheManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'leaderboardUpdate',
  on: true,
  async listener(SClient: ShardClient = getShardClient()) {
    const anemoSkillBoard = await showcaseLeaderboardGenerate('anemo-dmg-skill');
    const geoSkillBoard = await showcaseLeaderboardGenerate('geo-dmg-skill');
    const electroSkillBoard = await showcaseLeaderboardGenerate('electro-dmg-skill');
    const uniSkillBoard = await showcaseLeaderboardGenerate('uni-dmg-n5');

    const leaderboardDB = db.collection('leaderboards');

    const anemoMsg = (await leaderboardDB.doc('anemo-dmg-skill').get()).data();
    const geoMsg = (await leaderboardDB.doc('geo-dmg-skill').get()).data();
    const electroMsg = (await leaderboardDB.doc('electro-dmg-skill').get()).data();
    const uniMsg = (await leaderboardDB.doc('uni-dmg-n5').get()).data();
    const webhookMsg = (await leaderboardDB.doc('webhook').get()).data() as {
      webhookID: string;
      channelID: string;
    };

    const leaderboardHook = await SClient.rest.fetchWebhook(webhookMsg.webhookID);
    await Promise.all([
      leaderboardHook
        .editMessage(anemoMsg?.messageID, { embeds: [anemoSkillBoard] })
        .catch((err) => {
          console.log('Anemo leaderboard update failed');
          Debugging.leafDebug(err, true);
        }),
      leaderboardHook.editMessage(geoMsg?.messageID, { embeds: [geoSkillBoard] }).catch((err) => {
        console.log('Geo leaderboard update failed');
        Debugging.leafDebug(err, true);
      }),
      leaderboardHook
        .editMessage(electroMsg?.messageID, { embeds: [electroSkillBoard] })
        .catch((err) => {
          console.log('Electro leaderboard update failed');
          Debugging.leafDebug(err, true);
        }),
      leaderboardHook.editMessage(uniMsg?.messageID, { embeds: [uniSkillBoard] }).catch((err) => {
        console.log('Uni leaderboard update failed');
        Debugging.leafDebug(err, true);
      }),
    ]).then(() => {
      console.log('Leaderboard updated!');
    });
  },
});
