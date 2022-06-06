import { Webhook } from 'detritus-client/lib/structures';
import { SimpleEmbed } from '../../botTypes/interfaces';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, COLORS } from '../../lib/Constants';
import db from '../../lib/Firestore';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'hallOfFameSend',
  on: true,
  async listener(webhook: Webhook) {
    const anemoCrownBoard: SimpleEmbed = {
      title: 'Anemo placeholder',
      description: 'Will be updated soon',
    };

    const geoCrownBoard: SimpleEmbed = {
      title: 'Geo placeholder',
      description: 'Will be updated soon',
    };

    const electroCrownBoard: SimpleEmbed = {
      title: 'Electro placeholder',
      description: 'Will be updated soon',
    };

    const unalignedCrownBoard: SimpleEmbed = {
      title: 'Unaligned placeholder',
      description: 'Will be updated soon',
    };

    const information: SimpleEmbed = {
      color: COLORS.EMBED_COLOR,
      title: '**Welcome to Hall Of Fame!**',
      description:
        'Welcome to Hall of Fame Traveler!\nHere you will find names of people who have crowned their traveler',
      fields: [
        {
          name: '***How do I enter?***',
          value: `Send an image of your traveler's talent screen <#${ChannelIds.ROLE_APPLICATION}>. After approval, Hall of Fame will get updated automatically!`,
        },
        {
          name: '**FAQs**',
          value: `Q1. The number of crowns in my name is incorrect!\nA. Please send a new screenshot of your traveler's talent screen again at <#${ChannelIds.ROLE_APPLICATION}>. After approval, it will get auto updated!\n\nQ2. My name is not here...\nA. Due to Discord Embed's Character limit of total 6000, only limited entries are shown. You can still view your name via command`,
        },
      ],
    };

    await webhook.createMessage({ embed: information });

    await webhook.createMessage({ embed: anemoCrownBoard, wait: true }).then((message) => {
      db.collection('hall-of-fame').doc('anemo-crown').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: geoCrownBoard, wait: true }).then((message) => {
      db.collection('hall-of-fame').doc('geo-crown').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: electroCrownBoard, wait: true }).then((message) => {
      db.collection('hall-of-fame').doc('electro-crown').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: unalignedCrownBoard, wait: true }).then((message) => {
      db.collection('hall-of-fame').doc('unaligned-crown').set({
        messageID: message?.id,
      });
    });

    PMAEventHandler.emit('hallOfFameUpdate');
  },
});
