import { ShardClient } from 'detritus-client';
import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { showcaseSpiralAbyssGenerate } from '../../lib/spiralAbyssCacheManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'spiralAbyssUpdate',
  on: true,
  async listener(SClient: ShardClient = getShardClient()) {
    const travelerClearBoard = await showcaseSpiralAbyssGenerate(true);
    const normalClearBoard = await showcaseSpiralAbyssGenerate(false);

    const spiralAbyssDB = db.collection('spiral-abyss-config');

    const travelerClearMsg = (await spiralAbyssDB.doc('traveler-clear').get()).data();
    const normalClearMsg = (await spiralAbyssDB.doc('normal-clear').get()).data();
    const webhookMsg = (await spiralAbyssDB.doc('webhook').get()).data() as {
      webhookID: string;
      channelID: string;
    };

    const spiralAbyssHook = await SClient.rest.fetchWebhook(webhookMsg.webhookID);
    await Promise.all([
      spiralAbyssHook
        .editMessage(travelerClearMsg?.messageID, { embeds: [travelerClearBoard] })
        .catch((err) => {
          console.log('Traveler Clear Board update failed');
          Debugging.leafDebug(err, true);
        }),
      spiralAbyssHook
        .editMessage(normalClearMsg?.messageID, { embeds: [normalClearBoard] })
        .catch((err) => {
          console.log('Normal Clear Board update failed');
          Debugging.leafDebug(err, true);
        }),
    ]).then(() => {
      console.log('Spiral Abyss boards updated!');
    });
  },
});
