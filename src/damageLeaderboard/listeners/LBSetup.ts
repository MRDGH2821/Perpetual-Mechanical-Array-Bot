import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import type { APIEmbed, ForumChannel, TextChannel } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import {
  ChannelIds, COLORS, ICONS, ThreadIds,
} from '../../lib/Constants';
import db from '../../lib/Firestore';

type LBSetupArgs = {
  forumChannel?: ForumChannel;
  textChannel?: TextChannel;
};
@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'LBSetup',
  name: 'Leaderboard Channel Setup',
})
export default class LBSetup extends Listener {
  public async run(channels: LBSetupArgs) {
    const { logger } = container;
    logger.debug('Got', channels);

    await db
      .collection('leaderboard-config')
      .doc('channel')
      .set(
        { forumId: channels.forumChannel?.id, channelId: channels.textChannel?.id },
        {
          merge: true,
        },
      )
      .then(() => {
        logger.debug('Channels registered in database for Leaderboard');
        if (channels.textChannel) {
          this.setupSummaryChannel(channels.textChannel).catch(logger.error);
        }
      })
      .catch(logger.error);
  }

  // eslint-disable-next-line class-methods-use-this
  public async setupSummaryChannel(channel: TextChannel) {
    const anemoSkillBoard: APIEmbed = {
      title: 'Anemo placeholder',
      description: 'Will be updated soon',
      color: COLORS.ANEMO,
    };

    const geoSkillBoard: APIEmbed = {
      title: 'Geo placeholder',
      description: 'Will be updated soon',
      color: COLORS.GEO,
    };

    const electroSkillBoard: APIEmbed = {
      title: 'Electro placeholder',
      description: 'Will be updated soon',
      color: COLORS.ELECTRO,
    };

    const dendroSkillBoard: APIEmbed = {
      title: 'Dendro placeholder',
      description: 'Will be updated soon',
      color: COLORS.DENDRO,
    };

    const hydroSkillBoard: APIEmbed = {
      title: 'Hydro Placeholder',
      description: 'Will be updated soon',
      color: COLORS.HYDRO,
    };

    const uniSkillBoard: APIEmbed = {
      title: 'Universal placeholder',
      description: 'Will be updated soon',
      color: COLORS.UNIVERSAL,
    };

    const cmd = container.client.application?.commands.cache.find(
      (command) => command.name === 'leaderboard',
    );
    const subCmd = cmd?.options.find((option) => option.name === 'register');

    const subCmdMention = `</${cmd?.name || 'leaderboard'} ${
      subCmd?.name || 'register'
    }:${cmd?.id}>`;
    const information: APIEmbed = {
      color: COLORS.EMBED_COLOR,
      title: '**Traveler Mains Damage Leaderboards**',
      description:
        "_This leaderboard is not a measurement of your traveler's power, it's mostly for fun. Just because you're not on top doesn't mean you're bad. This is an arbitrary damage per screenshot leaderboard._",
      fields: [
        {
          name: '***What are the rules?***',
          value:
            'All fights must be against "Masanori" - the nameless samurai.\n\n **Solo Traveler** - Must only use Traveler in the party. No resonance, food, potion, coop mode, etc.\n **Open Category** - All the other restrictions besides Masanori being the target are lifted. Any form of buffing is allowed.',
        },
        {
          name: '***How do I enter?***',
          value: `Send an image (preferably a video) with damage number, element & group category type as message text, of your fight against "Masanori" - the nameless samurai in <#${
            ChannelIds.SHOWCASE
          }>.\nCopy the message link and use ${
            subCmdMention || '`/leaderboard register`'
          } command at <#${
            ThreadIds.LEADERBOARD_APPLICATION
          }>. After registering, ping a mod to get approval!\n\nExample format: \`uni 12345 solo\``,
        },
        {
          name: '***Why "Masanori" - the nameless samurai?***',
          value:
            "Because he's easy to access, he's not in a domain (no slow load times), has no varying elemental resistance, and generally a bro. Dude has an **10% elemental resistance** across all elements, and **-20% physical resistance**. ",
        },
      ],
    };

    const webhooks = await channel.guild.fetchWebhooks();

    const botHooks = webhooks.filter((hook) => hook.owner?.id === this.container.client.user?.id);

    let webhook = botHooks.filter((hook) => hook.name === 'Damage Leaderboard').first();
    const webhookOptions = {
      name: 'Damage Leaderboard',
      avatar: Buffer.from(await (await fetch(ICONS.MASANORI)).arrayBuffer()),
    };

    if (webhook) {
      webhook.edit({
        name: webhookOptions.name,
        avatar: webhookOptions.avatar,
        channel,
        reason: 'Damager Leaderboard Webhook channel changed',
      });
    } else {
      webhook = await channel.createWebhook({
        name: webhookOptions.name,
        avatar: webhookOptions.avatar,
        reason: "Creating webhook for 'Damage Leaderboard'",
      });
    }

    await db
      .collection('leaderboards')
      .doc('webhook')
      .set({
        webhookID: webhook.id,
        channelID: webhook.channelId,
      })
      .then(() => container.logger.debug('Webhook details saved in database'))
      .catch(container.logger.error);

    await webhook.send({ embeds: [information] });

    await webhook.send({ embeds: [uniSkillBoard] }).then((message) => {
      db.collection('leaderboards')
        .doc('uni-dmg-n5')
        .set({
          messageID: message?.id,
        });
    });

    await webhook.send({ embeds: [anemoSkillBoard] }).then((message) => {
      db.collection('leaderboards')
        .doc('anemo-dmg-skill')
        .set({
          messageID: message?.id,
        });
    });

    await webhook.send({ embeds: [geoSkillBoard] }).then((message) => {
      db.collection('leaderboards')
        .doc('geo-dmg-skill')
        .set({
          messageID: message?.id,
        });
    });

    await webhook.send({ embeds: [electroSkillBoard] }).then((message) => {
      db.collection('leaderboards')
        .doc('electro-dmg-skill')
        .set({
          messageID: message?.id,
        });
    });

    await webhook.send({ embeds: [dendroSkillBoard] }).then((message) => {
      db.collection('leaderboards')
        .doc('dendro-dmg-skill')
        .set({
          messageID: message?.id,
        });
    });

    await webhook.send({ embeds: [hydroSkillBoard] }).then((message) => {
      db.collection('leaderboards')
        .doc('hydro-dmg-skill')
        .set({
          messageID: message?.id,
        });
    });

    PMAEventHandler.emit('LBUpdate');
  }
}
