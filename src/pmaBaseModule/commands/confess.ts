import { RequestTypes } from 'detritus-client-rest';
import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Embed } from 'detritus-client/lib/utils';
import { ConfessArgs } from '../../botTypes/interfaces';
import { ChannelIds, COLORS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { Debugging } from '../../lib/Utilities';

function processConfession(confession: string) {
  return confession.replaceAll('\\n', '\n');
}

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
      description: 'Post as Anonymous? (default: False)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
    {
      name: 'ping_archons',
      description: 'Notify Archons? (default: False)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
    {
      name: 'image_upload',
      description: 'Upload an Image',
      type: ApplicationCommandOptionTypes.ATTACHMENT,
      default: false,
    },
    {
      name: 'image_link',
      description: 'Direct Image link',
      type: ApplicationCommandOptionTypes.STRING,
      default: false,
    },
    {
      name: 'skip_multiline',
      description: 'Skip processing multiline (default: False)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: false,
    },
  ],
  async run(ctx, args: ConfessArgs) {
    const isAnon = args.anonymous;
    const shouldPingArchons = args.ping_archons;

    const confessChannel = ctx.guild?.channels.get(ChannelIds.CONFESSIONS);

    const logsChannel = ctx.guild?.channels.get(ChannelIds.ARCHIVES);

    const description = args.skip_multiline
      ? args.confession!
      : processConfession(args.confession!);

    // const description = args.confession;
    const anonEmbed: RequestTypes.CreateChannelMessageEmbed = {
      title: '**A New confession!**',
      author: {
        name: 'Anonymous',
      },
      color: COLORS.EMBED_COLOR,
      description,
      image: {
        url: args.image_upload?.url || args.image_link || '',
      },
      timestamp: new Date().toISOString(),
    };

    const confessEmbed: RequestTypes.CreateChannelMessageEmbed = {
      title: '**A New confession!**',
      author: {
        name: ctx.member?.nick || ctx.member?.username,
        iconUrl: ctx.user.avatarUrl,
        url: ctx.user.jumpLink,
      },
      color: COLORS.EMBED_COLOR,
      description,
      timestamp: new Date().toISOString(),
      image: {
        url: args.image_upload?.url || args.image_link || '',
      },
      thumbnail: {
        url: ctx.user.avatarUrl,
      },
      footer: {
        text: `by - ${ctx.user.tag}`,
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
      embeds: [new Embed(confessEmbed).addField('**Unprocessed text**', args.confession!)],
      file: {
        filename: `Confession by ${ctx.user.tag} on ${new Date()}.txt`,
        value: `Author: ${ctx.user.tag}\n\nConfession:\n${args.confession}\n\nMedia: \n ${args.image_link} ${args.image_upload}`,
      },
    });
  },

  onError(ctx, err) {
    Debugging.leafDebug(err, true);
  },
});
