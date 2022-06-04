import { Webhook } from 'detritus-client/lib/structures';
import { SimpleEmbed } from '../../botTypes/interfaces';
import BotEvent from '../../lib/BotEvent';
import { ChannelIds, COLORS } from '../../lib/Constants';
import db from '../../lib/Firestore';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: 'leaderboardSend',
  on: true,
  async listener(webhook: Webhook) {
    const anemoSkillBoard: SimpleEmbed = {
      title: 'Anemo placeholder',
      description: 'Will be updated soon',
    };

    const geoSkillBoard: SimpleEmbed = {
      title: 'Geo placeholder',
      description: 'Will be updated soon',
    };

    const electroSkillBoard: SimpleEmbed = {
      title: 'Electro placeholder',
      description: 'Will be updated soon',
    };

    const uniSkillBoard: SimpleEmbed = {
      title: 'Universal placeholder',
      description: 'Will be updated soon',
    };

    const information: SimpleEmbed = {
      color: COLORS.EMBED_COLOR,
      title: '**Traveler Mains Damage Leaderboards**',
      description:
        "_This leaderboard is not a measurement of your traveler's power, it's mostly for fun. Just because you're not on top doesn't mean you're bad. This is an arbitrary damage per screenshot leaderboard._",
      fields: [
        {
          name: '***What are the rules?***',
          value:
            'All fights must be against "Masanori" - the nameless samurai.\n\n> **Solo Traveler** - Must only use Traveler in the party. No resonance, food, potion, coop mode, etc.\n> **Open Category** - All the other restrictions besides Masanori being the target are lifted. Any form of buffing is allowed.',
        },
        {
          name: '***How do I enter?***',
          value: `Send an image (preferably a video) with damage number as message text, of your fight against "Masanori" - the nameless samurai in <#${ChannelIds.SHOWCASE}>.\nCopy the message link and use \`/leaderboard register\` command at <#950365539073675274>. After registering, ping a mod to get approval!`,
        },
        {
          name: '***Why "Masanori" - the nameless samurai?***',
          value:
            "Because he's easy to access, he's not in a domain (no slow load times), has no varying elemental resistance, and generally a bro. Dude has an **10% elemental resistance** across all elements, and **-20% physical resistance**. ",
        },
      ],
    };

    await webhook.createMessage({ embed: information });

    await webhook.createMessage({ embed: anemoSkillBoard, wait: true }).then((message) => {
      db.collection('leaderboards').doc('anemo-dmg-skill').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: geoSkillBoard, wait: true }).then((message) => {
      db.collection('leaderboards').doc('geo-dmg-skill').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: electroSkillBoard, wait: true }).then((message) => {
      db.collection('leaderboards').doc('electro-dmg-skill').set({
        messageID: message?.id,
      });
    });

    await webhook.createMessage({ embed: uniSkillBoard, wait: true }).then((message) => {
      db.collection('leaderboards').doc('uni-dmg-n5').set({
        messageID: message?.id,
      });
    });

    PMAEventHandler.emit('leaderboardUpdate', webhook.client.rest);
  },
});
