import { RestClient } from 'detritus-client/lib/rest';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { showcaseLeaderboardGenerate } from '../../lib/leaderboardCacheManager';
import { getRestClient } from '../../lib/RestClientExtracted';

export default new BotEvent({
  event: 'leaderboardUpdate',
  on: true,
  async listener(RClient: RestClient = getRestClient()) {
    const anemoSkillBoard = await showcaseLeaderboardGenerate('anemo-dmg-skill');
    const geoSkillBoard = await showcaseLeaderboardGenerate('geo-dmg-skill');
    const electroSkillBoard = await showcaseLeaderboardGenerate('electro-dmg-skill');
    const uniSkillBoard = await showcaseLeaderboardGenerate('uni-dmg-n5');

    const leaderboardDB = db.collection('leaderboards');

    const anemoMsg = (await leaderboardDB.doc('anemo-dmg-skill').get()).data();
    const geoMsg = (await leaderboardDB.doc('geo-dmg-skill').get()).data();
    const electroMsg = (await leaderboardDB.doc('electro-dmg-skill').get()).data();
    const uniMsg = (await leaderboardDB.doc('uni-dmg-skill').get()).data();
    const webhookMsg = (await leaderboardDB.doc('webhook').get()).data();

    const leaderboardHook = await RClient.fetchWebhook(webhookMsg?.webhookID);

    leaderboardHook.editMessage(anemoMsg?.messageID, { embed: anemoSkillBoard });
    leaderboardHook.editMessage(geoMsg?.messageID, { embed: geoSkillBoard });
    leaderboardHook.editMessage(electroMsg?.messageID, { embed: electroSkillBoard });
    leaderboardHook.editMessage(uniMsg?.messageID, { embed: uniSkillBoard });

    console.log('Leaderboard updated!');
  },
});
