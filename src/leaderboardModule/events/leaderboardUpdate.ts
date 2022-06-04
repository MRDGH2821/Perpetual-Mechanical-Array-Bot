import { RestClient } from 'detritus-client/lib/rest';
import { Webhook } from 'detritus-client/lib/structures';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { showcaseLeaderboardGenerate } from '../../lib/leaderboardCacheManager';
import { LeaderboardUpdateEventArgs } from '../../botTypes/types';
import EnvConfig from '../../lib/EnvConfig';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'leaderboardUpdate',
  on: true,
  async listener(args: LeaderboardUpdateEventArgs) {
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

    let leaderboardHook: Webhook;
    if (args.webhook !== undefined) {
      leaderboardHook = args.webhook;
    } else if (args.SClient !== undefined) {
      const guild = await args.SClient.guilds.find((guild) => guild.id === EnvConfig.guildId);
      try {
        const channel = await guild?.textChannels.find(
          (channel) => channel.id === webhookMsg.channelID,
        );
        leaderboardHook = await (
          await channel?.fetchWebhooks()
        ).find((webhook) => webhook.id === webhookMsg.webhookID);
      } catch (error) {
        Debugging.leafDebug(error, true);
      }
    }

    leaderboardHook.editMessage(anemoMsg?.messageID, {
      embed: anemoSkillBoard,
    });
    leaderboardHook.editMessage(geoMsg?.messageID, { embed: geoSkillBoard });
    leaderboardHook.editMessage(electroMsg?.messageID, { embed: electroSkillBoard });
    leaderboardHook.editMessage(uniMsg?.messageID, { embed: uniSkillBoard });

    console.log('Leaderboard updated!');
  },
});
