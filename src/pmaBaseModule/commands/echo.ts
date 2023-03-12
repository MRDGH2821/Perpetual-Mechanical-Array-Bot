import {
  ApplicationCommandOptionTypes,
  ChannelTypes,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { EchoArgs, NadekoContent, SimpleEmbed } from '../../botTypes/interfaces';
import { COLORS } from '../../lib/Constants';
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
  onRunError(ctx, args, error) {
    Debugging.leafDebug(error, true);
    ctx.editOrRespond({
      content: 'An error occurred',
      files: [
        {
          value: `${error}`,
          filename: 'Echo command error.txt',
        },
        {
          value: JSON.stringify(args),
          filename: 'Echo command args.json',
        },
      ],
    });
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
            value: JSON.stringify(args),
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
            content: `Sent!\nCheck out ${channel?.mention}`,
            flags: MessageFlags.EPHEMERAL,
          });
        } catch (error) {
          Debugging.leafDebug(error, true);
        }
      },
    },
    {
      name: 'help',
      description: 'Describes how to use this command',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      async run(ctx) {
        const sampleEmbed: SimpleEmbed = {
          color: COLORS.EMBED_COLOR,
          title: 'Sample Title',
          author: {
            name: ctx.user.tag,
            iconUrl: `${ctx.user.defaultAvatarUrl}`,
            url: ctx.user.jumpLink,
          },
          description: 'Sample description',
          fields: [
            {
              name: 'Sample field name 1',
              value: 'Sample field value 1',
            },
            {
              name: 'Sample field name 2',
              value: 'Sample field value 2',
            },
          ],
          url: 'https://youtu.be/dQw4w9WgXcQ',
          footer: {
            text: 'Sample Footer text',
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/3596/3596176.png',
          },
          image: {
            url: 'https://i.imgur.com/nvFoMIK.jpg',
          },
          thumbnail: {
            url: 'https://i.imgur.com/JRVixj1.png',
          },
          timestamp: new Date().toISOString(),
        };

        const sampleNadekoEmbed: NadekoContent = {
          content: 'Sample Message text',
          embeds: [
            {
              title: 'Sample Embed 1',
              author: {
                name: ctx.user.tag,
                icon_url: ctx.user.avatarUrl,
              },
              color: '#E0D1BD',
              description: 'Sample Description',
              fields: [
                {
                  name: 'Sample field name 1',
                  value: 'Sample field value 1',
                },
                {
                  name: 'Sample field name 2',
                  value: 'Sample field value 2',
                },
              ],
              footer: {
                text: 'Sample Footer text',
                icon_url: 'https://cdn-icons-png.flaticon.com/512/3596/3596176.png',
              },
              image: 'https://i.imgur.com/nvFoMIK.jpg',
              url: 'https://youtu.be/dQw4w9WgXcQ',
              thumbnail: 'https://i.imgur.com/JRVixj1.png',
            },
            {
              title: '**ALERT!!**',
              description: 'Do not, I Repeat, DO NOT CLICK/SCAN SUS LINKS/QR CODES!',
              color: '#ff0033',
            },
          ],
        };

        const helpEmbed: SimpleEmbed = {
          title: '**Echo Help**',
          color: COLORS.EMBED_COLOR,
          fields: [
            {
              name: '**/echo text**',
              value: 'Sends text in given channel',
            },
            {
              name: '**/echo embed**',
              value:
                'Sends an embed which follows the format given [here](https://detritusjs.com/interfaces/gateway_rawevents.gatewayrawevents.rawmessageembed)\nTimestamp is in ISO-8601 format.\nColor is in hex format. (If you want color - `#ffffff`, put - `0xffffff` or use [this](https://www.checkyourmath.com/convert/color/hexadecimal_decimal.php))\n\n(This embed format is incompatible with `/echo nadeko` format)',
            },
            {
              name: '**/echo nadeko**',
              value:
                'Sends a Nadeko Style embed. Go to https://eb.nadeko.bot/ to make one. \n\n(This format is incompatible with `/echo embed` format',
            },
            {
              name: '\u200b',
              value:
                'The files attached can be opened with notepad which you can try out by putting it as an input for respective command.\nInputs are strictly expected to be in JSON format.\nMake sure that the key & value pairs are enclosed in double quotes. \nUse this to make sure it is valid: https://jsonlint.com/',
            },
          ],
        };

        await ctx.editOrRespond({
          embeds: [helpEmbed],
          files: [
            {
              filename: 'Sample_Embed_Format.json',
              value: JSON.stringify(sampleEmbed),
            },
            {
              filename: 'Sample_Nadeko_Embed_Format.json',
              value: JSON.stringify(sampleNadekoEmbed),
            },
          ],
        });
      },
    },
  ],
});
