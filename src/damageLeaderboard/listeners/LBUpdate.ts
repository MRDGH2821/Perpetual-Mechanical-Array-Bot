import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import db from '../../lib/Firestore';
import LeaderboardCache from '../lib/LeaderboardCache';

@ApplyOptions<Listener.Options>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'LBUpdate',
  name: 'Leaderboard Summary Channel Updater',
})
export default class LBUpdate extends Listener {
  public override async run() {
    const anemoSkillBoard = await LeaderboardCache.generateSummaryEmbed('anemo');
    const geoSkillBoard = await LeaderboardCache.generateSummaryEmbed('geo');
    const electroSkillBoard = await LeaderboardCache.generateSummaryEmbed('electro');
    const dendroSkillBoard = await LeaderboardCache.generateSummaryEmbed('dendro');
    const hydroSkillBoard = await LeaderboardCache.generateSummaryEmbed('hydro');
    const uniSkillBoard = await LeaderboardCache.generateSummaryEmbed('uni');

    const leaderboardDB = db.collection('leaderboards');

    const anemoMsg = (await leaderboardDB.doc('anemo-dmg-skill').get()).data();
    const geoMsg = (await leaderboardDB.doc('geo-dmg-skill').get()).data();
    const electroMsg = (await leaderboardDB.doc('electro-dmg-skill').get()).data();
    const dendroMsg = (await leaderboardDB.doc('dendro-dmg-skill').get()).data();
    const hydroMsg = (await leaderboardDB.doc('hydro-dmg-skill').get()).data();
    const uniMsg = (await leaderboardDB.doc('uni-dmg-n5').get()).data();
    const webhookMsg = (await leaderboardDB.doc('webhook').get()).data() as {
      webhookID: string;
      channelID: string;
    };

    const leaderboardHook = await container.client.fetchWebhook(webhookMsg.webhookID);
    await Promise.all([
      leaderboardHook
        .editMessage(anemoMsg?.messageID, { embeds: [anemoSkillBoard] })
        .catch((err) => {
          container.logger.fatal('Anemo leaderboard update failed');
          container.logger.error(err);
        }),
      leaderboardHook.editMessage(geoMsg?.messageID, { embeds: [geoSkillBoard] }).catch((err) => {
        container.logger.fatal('Geo leaderboard update failed');
        container.logger.error(err);
      }),
      leaderboardHook
        .editMessage(electroMsg?.messageID, { embeds: [electroSkillBoard] })
        .catch((err) => {
          container.logger.fatal('Electro leaderboard update failed');
          container.logger.error(err);
        }),
      leaderboardHook
        .editMessage(dendroMsg?.messageID, { embeds: [dendroSkillBoard] })
        .catch((err) => {
          container.logger.fatal('Dendro leaderboard update failed');
          container.logger.error(err);
        }),
      leaderboardHook
        .editMessage(hydroMsg?.messageID, { embeds: [hydroSkillBoard] })
        .catch((err) => {
          container.logger.fatal('Hydro leaderboard update failed');
          container.logger.error(err);
        }),
      leaderboardHook.editMessage(uniMsg?.messageID, { embeds: [uniSkillBoard] }).catch((err) => {
        container.logger.fatal('Uni leaderboard update failed');
        container.logger.error(err);
      }),
    ])
      .then(() => {
        container.logger.info('Leaderboard summary channel updated!');
      })
      .catch(container.logger.error);
  }
}
