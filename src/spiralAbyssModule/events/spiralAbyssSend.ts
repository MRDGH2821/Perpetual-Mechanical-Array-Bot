import { Webhook } from 'detritus-client/lib/structures';
import { SimpleEmbed } from '../../botTypes/interfaces';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, COLORS } from '../../lib/Constants';
import db from '../../lib/Firestore';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'spiralAbyssSend',
  on: true,
  async listener(webhook: Webhook) {
    const clearedWithTravelerBoard: SimpleEmbed = {
      title: 'Cleared with traveler placeholder',
      description: 'Will be updated soon',
    };

    const clearedNormallyBoard: SimpleEmbed = {
      title: 'Cleared normally placeholder',
      description: 'Will be updated soon',
    };

    const information: SimpleEmbed = {
      color: COLORS.SPIRAL_ABYSS,
      title: '**Spiral Abyss Hall Of Fame**',
      description: 'Welcome to Spiral Abyss Hall Of Fame Traveler!',
      fields: [
        {
          name: '***How do I enter?***',
          value: `Send an image of your spiral abyss clear screen or hoyolab battle chronicle screenshot at <#${ChannelIds.ROLE_APPLICATION}>. After approval, Hall of Fame will get updated automatically!`,
        },
        {
          name: '**FAQs**',
          value: `Q1. I cleared the Abyss again with Traveler, how to update?\nA. Please send a new screenshot of your spiral abyss clear screen again at <#${ChannelIds.ROLE_APPLICATION}>. After approval, it will get auto updated!\n\nQ2. My name is not here...\nA. Due to Discord Embed's Character limit of total 6000, only limited entries are shown. You can still view your name via command`,
        },
      ],
    };

    await webhook.createMessage({ embed: information });

    await webhook.createMessage({ embed: clearedWithTravelerBoard, wait: true }).then((message) => {
      db.collection('spiral-abyss-config').doc('traveler-clear').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: clearedNormallyBoard, wait: true }).then((message) => {
      db.collection('spiral-abyss-config').doc('normal-clear').set({
        messageID: message?.id,
      });
    });

    PMAEventHandler.emit('spiralAbyssUpdate');
  },
});
