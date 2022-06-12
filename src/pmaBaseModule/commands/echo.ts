import {
  ApplicationCommandOptionTypes,
  ChannelTypes,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Embed } from 'detritus-client/lib/utils';
import { EchoArgs } from '../../botTypes/interfaces';
import EnvConfig from '../../lib/EnvConfig';
import { Debugging, nadekoParse, StaffCheck } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'echo',
  global: false,
  guildIds: [EnvConfig.guildId],
  description: 'Echo a Message',
  onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  onRunError(ctx, args, err) {
    Debugging.leafDebug(err, true);
  },
  options: [
    {
      name: 'text',
      description: 'Send a text!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel to post into',
          required: true,
          type: ApplicationCommandOptionTypes.CHANNEL,
          channel_types: [ChannelTypes.GUILD_TEXT],
        },
        {
          name: 'text',
          description: 'Enter text to send',
          required: true,
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],

      async run(ctx, args: EchoArgs) {
        const { channel, text } = args;

        await channel?.createMessage({
          content: text,
        });

        await ctx.editOrRespond({
          content: `Sent!\nCheck out ${channel?.mention}`,
          flags: MessageFlags.EPHEMERAL,
        });
      },
    },
    {
      name: 'embed',
      description: 'Send an embed!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel to post into',
          required: true,
          type: ApplicationCommandOptionTypes.CHANNEL,
          channel_types: [ChannelTypes.GUILD_TEXT],
        },
        {
          name: 'embed',
          description: 'Put an embed in JSON format',
          required: true,
          type: ApplicationCommandOptionTypes.STRING,
        },
        {
          name: 'text',
          description: 'Enter text to send',
          required: false,
          type: ApplicationCommandOptionTypes.STRING,
          default: ' ',
        },
      ],
      async run(ctx, args: EchoArgs) {
        const { channel, text, embed } = args;

        if (embed) {
          const parsedEmbed = JSON.parse(embed);
          await channel
            ?.createMessage({
              embeds: [parsedEmbed],
              content: text,
            })
            .then(async () => {
              await ctx.editOrRespond({
                content: `Sent!\nCheck out ${channel?.mention}`,
                flags: MessageFlags.EPHEMERAL,
              });
            })
            .catch((err) => {
              throw new Error(`Input Embed is not in proper format\n${err}`);
            });
        } else {
          throw new Error('Input Embed is undefined');
        }
      },
      async onRunError(ctx, args: EchoArgs, error) {
        await ctx.editOrRespond({
          content: `An error occurred\n\nError: ${error}`,
          file: {
            filename: 'Input_Provided.json',
            value: args.embed,
          },
        });
      },
    },
    {
      name: 'nadeko',
      description: 'Send an nadeko embed!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel to post into',
          required: true,
          type: ApplicationCommandOptionTypes.CHANNEL,
          channel_types: [ChannelTypes.GUILD_TEXT],
        },
        {
          name: 'nadeko_json',
          description: 'Put Nadeko embed string as it is',
          required: true,
          type: ApplicationCommandOptionTypes.STRING,
        },
      ],
      async run(ctx, args: EchoArgs) {
        const { channel } = args;
        try {
          const parsed = nadekoParse(args.nadeko_json!);
          Debugging.leafDebug(parsed, true);
          await channel?.createMessage({
            content: parsed.content,
            embeds: parsed.embeds,
          });

          await ctx.editOrRespond({
            content: 'Sent!',
            flags: MessageFlags.EPHEMERAL,
          });
        } catch (error) {
          Debugging.leafDebug(error, true);
        }
      },
    },
  ],
});
