import { ShardClient } from 'detritus-client';
import { getShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import db from '../../lib/Firestore';
import { showcaseHallOfFameGenerate } from '../../lib/hallOfFameCacheManager';
import { Debugging } from '../../lib/Utilities';

export default new BotEvent({
  event: 'hallOfFameUpdate',
  on: true,
  async listener(SClient: ShardClient = getShardClient()) {
    const anemoCrownBoard = await showcaseHallOfFameGenerate('anemo');
    const geoCrownBoard = await showcaseHallOfFameGenerate('geo');
    const electroCrownBoard = await showcaseHallOfFameGenerate('electro');
    const unalignedCrownBoard = await showcaseHallOfFameGenerate('unaligned');

    const hallOfFameDB = db.collection('hall-of-fame');

    const anemoMsg = (await hallOfFameDB.doc('anemo-crown').get()).data();
    const geoMsg = (await hallOfFameDB.doc('geo-crown').get()).data();
    const electroMsg = (await hallOfFameDB.doc('electro-crown').get()).data();
    const unalignedMsg = (await hallOfFameDB.doc('unaligned-crown').get()).data();
    const webhookMsg = (await hallOfFameDB.doc('webhook').get()).data() as {
      webhookID: string;
      channelID: string;
    };

    const hallOfFameHook = await SClient.rest.fetchWebhook(webhookMsg.webhookID);
    await Promise.all([
      hallOfFameHook
        .editMessage(anemoMsg?.messageID, { embeds: [anemoCrownBoard] })
        .catch((err) => {
          console.log('Anemo hall of fame update failed');
          Debugging.leafDebug(err, true);
        }),
      hallOfFameHook.editMessage(geoMsg?.messageID, { embeds: [geoCrownBoard] }).catch((err) => {
        console.log('Geo hall of fame update failed');
        Debugging.leafDebug(err, true);
      }),
      hallOfFameHook
        .editMessage(electroMsg?.messageID, { embeds: [electroCrownBoard] })
        .catch((err) => {
          console.log('Electro hall of fame update failed');
          Debugging.leafDebug(err, true);
        }),
      hallOfFameHook
        .editMessage(unalignedMsg?.messageID, { embeds: [unalignedCrownBoard] })
        .catch((err) => {
          console.log('Unaligned hall of fame update failed');
          Debugging.leafDebug(err, true);
        }),
    ]).then(() => {
      console.log('Hall of Fame updated!');
    });
  },
});
