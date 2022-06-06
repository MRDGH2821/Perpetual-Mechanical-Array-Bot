import { RequestTypes } from 'detritus-client-rest';
import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ChannelIds, COLORS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

export default new InteractionCommand({
  name: 'confess',
  description: 'Wanna confess something?',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  options: [
    {
      name: 'confession',
      description: 'Enter your confession!',
      required: true,
      type: ApplicationCommandOptionTypes.STRING,
    },
    {
      name: 'anonymous',
      description: 'Post as Anonymous?',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
    {
      name: 'ping_archons',
      description: 'Notify Archons?',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
  ],
  async run(ctx, args) {
    const isAnon = args.anonymous;
    const shouldPingArchons = args.ping_archons;

    const confessChannel = ctx.guild?.channels.get(ChannelIds.CONFESSIONS);

    const logsChannel = ctx.guild?.channels.get(ChannelIds.ARCHIVES);

    const anonEmbed: RequestTypes.CreateChannelMessageEmbed = {
      title: '**A New confession!**',
      author: {
        name: 'Anonymous',
      },
      color: COLORS.EMBED_COLOR,
      description: args.confession,
      timestamp: new Date().toISOString(),
    };

    const confessEmbed: RequestTypes.CreateChannelMessageEmbed = {
      title: '**A New confession!**',
      author: {
        name: ctx.user.tag,
        iconUrl: ctx.user.avatarUrl,
        url: ctx.user.jumpLink,
      },
      color: COLORS.EMBED_COLOR,
      description: args.confession,
      timestamp: new Date().toISOString(),
      thumbnail: {
        url: ctx.user.avatarUrl,
      },
    };

    const pingText = shouldPingArchons ? `<@&${ROLE_IDS.OTHERS.ARCHONS}>` : ' ';

    if (isAnon) {
      await confessChannel?.createMessage({
        embeds: [anonEmbed],
        content: pingText,
      });

      await ctx.editOrRespond({
        content: `Confession sent as Anonymous!\nCheck out <#${confessChannel?.id}>`,
        flags: MessageFlags.EPHEMERAL,
      });
    } else {
      confessChannel?.createMessage({
        embeds: [confessEmbed],
        content: pingText,
      });

      await ctx.editOrRespond({
        content: `Confession sent!\nCheck out <#${confessChannel?.id}>`,
        flags: MessageFlags.EPHEMERAL,
      });
    }

    logsChannel?.createMessage({
      embeds: [confessEmbed],
    });
  },
});
