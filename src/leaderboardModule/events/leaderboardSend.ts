import { IEvent, SimpleEmbed } from '@bot-types/interfaces';
import { ChannelIds, COLORS } from '@lib/Constants';
import db from '@lib/Firestore';
import { showcaseLeaderboardGenerate } from '@lib/leaderboardManager';
import { Webhook } from 'detritus-client/lib/structures';

const leaderboardSend: IEvent = {
  event: 'leaderboardSend',
  on: true,
  async listener(webhook: Webhook) {
    const anemoSkillBoard = await showcaseLeaderboardGenerate('anemo-dmg-skill');

    const geoSkillBoard = await showcaseLeaderboardGenerate('geo-dmg-skill');

    const electroSkillBoard = await showcaseLeaderboardGenerate('electro-dmg-skill');

    const uniSkillBoard = await showcaseLeaderboardGenerate('uni-dmg-n5');

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

    await db
      .collection('leaderboards')
      .doc('anemo-dmg-skill')
      .set({
        messageID: (await webhook.createMessage({ embed: anemoSkillBoard }))?.id,
      });

    await db
      .collection('leaderboards')
      .doc('geo-dmg-skill')
      .set({
        messageID: (await webhook.createMessage({ embed: geoSkillBoard }))?.id,
      });

    await db
      .collection('leaderboards')
      .doc('electro-dmg-skill')
      .set({
        messageID: (await webhook.createMessage({ embed: electroSkillBoard }))?.id,
      });

    await db
      .collection('leaderboards')
      .doc('uni-dmg-n5')
      .set({
        messageID: (await webhook.createMessage({ embed: uniSkillBoard }))?.id,
      });
  },
};

export default leaderboardSend;
