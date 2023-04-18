import { isGuildMember } from '@sapphire/discord.js-utilities';
import { Command, container } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { Time } from '@sapphire/time-utilities';
import {
  ActionRowBuilder,
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandSubCommandData,
  ApplicationCommandType,
  Attachment,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  ComponentType,
  GuildMember,
  Message,
  MessageFlags,
  roleMention,
  TextInputStyle,
} from 'discord.js';
import { ChannelIds, COLORS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { parseTruthy, serverLogChannel } from '../../lib/utils';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import { guildMessageIDsExtractor } from '../lib/Utilities';

type SendConfessionArgs = {
  confession: string;
  shouldSkipMultiline: boolean;
  isAnon: boolean;
  shouldPingArchons: boolean;
  confessor: GuildMember;
  imageLink?: string | null | undefined;
  imageAttachment?: Attachment | null | undefined;
  reply?: {
    originalMessage: Message;
  };
};

const subCmdOpt: ApplicationCommandSubCommandData['options'] = [
  {
    name: 'confession',
    description: 'Enter your confession!',
    required: true,
    type: ApplicationCommandOptionType.String,
  },
  {
    name: 'anonymous',
    description: 'Post as Anonymous? (default: False)',
    type: ApplicationCommandOptionType.Boolean,
  },
  {
    name: 'ping_archons',
    description: 'Notify Archons? (default: False)',
    type: ApplicationCommandOptionType.Boolean,
  },
  {
    name: 'image_upload',
    description: 'Upload an Image',
    type: ApplicationCommandOptionType.Attachment,
  },
  {
    name: 'image_link',
    description: 'Input image link',
    type: ApplicationCommandOptionType.String,
  },
  {
    name: 'skip_multiline',
    description: 'Skip parsing multiline (default: False)',
    type: ApplicationCommandOptionType.Boolean,
  },
];

const cmdDef: JSONCmd = {
  name: 'confession',
  description: 'Wanna confess?',
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'new',
      description: 'Wanna confess?',
      options: subCmdOpt,
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'reply',
      description: 'Wanna reply to confession with confession?',
      options: [
        {
          name: 'message_link',
          description: 'Message link of the OG confession you want to reply to',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        ...subCmdOpt,
      ],
    },
  ],
};

export default class GuildCommand extends Subcommand {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });

    registry.registerContextMenuCommand(
      {
        name: 'Reply to Confession',
        dm_permission: false,
        dmPermission: false,
        type: ApplicationCommandType.Message,
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }

  public static processConfession(confession: string) {
    return confession.replaceAll('\\n', '\n');
  }

  public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    if (!interaction.isMessageContextMenuCommand()) return;

    const msg = interaction.targetMessage;
    const OGConfessEmbed = msg.embeds[0];

    if (msg.channelId === ChannelIds.CONFESSIONS) {
      await interaction.showModal({
        title: `Replying to ${OGConfessEmbed.author?.name}`,
        custom_id: 'confess_modal',
        customId: 'confess_modal',
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                label: 'Your Reply',
                type: ComponentType.TextInput,
                style: TextInputStyle.Paragraph,
                placeholder: 'Enter your reply to this confession',
                required: true,
                custom_id: 'confession_reply',
                max_length: 1000,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                label: 'Post as Anonymous?',
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                placeholder: 'Post as anonymous? (Yes/No/True/False) (Default: No)',
                custom_id: 'anonymous',
                required: false,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                label: 'Ping Archons?',
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                placeholder: 'Notify Archons? (Yes/No/True/False) (Default: No)',
                custom_id: 'ping_archons',
                required: false,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                label: 'Image link',
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                placeholder: 'Input Image link (optional)',
                custom_id: 'image_link',
                required: false,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                label: 'Skip Multiline Processing?',
                type: ComponentType.TextInput,
                style: TextInputStyle.Short,
                placeholder: 'Skip parsing multiline? (Yes/No/True/False) (Default: No)',
                custom_id: 'skip_multiline',
                required: false,
              },
            ],
          },
        ],
      });

      await interaction
        .awaitModalSubmit({
          time: 3 * Time.Minute,
          async filter(itx) {
            return itx.customId === 'confess_modal';
          },
        })
        .then((modalCtx) => {
          const confessionReply = modalCtx.fields.getTextInputValue('confession_reply');
          const anonymous = modalCtx.fields.getTextInputValue('anonymous');
          const pingArchons = modalCtx.fields.getTextInputValue('ping_archons');
          const imageLink = modalCtx.fields.getTextInputValue('image_link');
          const skipMultiline = modalCtx.fields.getTextInputValue('skip_multiline');

          const isAnon = parseTruthy(anonymous);
          const shouldPingArchons = parseTruthy(pingArchons);
          const shouldSkipMultiline = parseTruthy(skipMultiline);
          const confessor = interaction.member;

          if (!isGuildMember(confessor)) {
            throw new Error('Cannot fetch Member');
          }
          this.sendConfession({
            confession: confessionReply,
            confessor,
            isAnon,
            shouldPingArchons,
            shouldSkipMultiline,
            imageLink,
            reply: {
              originalMessage: msg,
            },
          });

          return modalCtx.reply({
            content: `Confession sent!\nCheck out ${channelMention(ChannelIds.CONFESSIONS)}`,
            flags: MessageFlags.Ephemeral,
          });
        })
        .catch(console.error);
    } else {
      await interaction.reply({
        content: 'Cannot reply to random message outside confession channel',
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const confession = interaction.options.getString('confession', true);
    const shouldSkipMultiline = interaction.options.getBoolean('skip_multiline') || false;
    const isAnon = interaction.options.getBoolean('anonymous') || false;
    const shouldPingArchons = interaction.options.getBoolean('ping_archons') || false;
    const imageAttachment = interaction.options.getAttachment('image_upload');
    const imageLink = interaction.options.getString('image_link');

    const ogConfessionLink = interaction.options.getString('message_link');

    const confessor = interaction.member;

    if (!isGuildMember(confessor)) {
      await interaction.editReply('Cannot fetch Member');
      return;
    }

    let reply: SendConfessionArgs['reply'];
    if (ogConfessionLink) {
      const ids = guildMessageIDsExtractor(ogConfessionLink);
      container.logger.debug({ ids });

      const channel = await interaction.guild?.channels.fetch(ChannelIds.CONFESSIONS);
      if (!channel?.isTextBased()) {
        await interaction.editReply('Cannot fetch confession channel');
        return;
      }

      const message = await channel.messages.fetch(ids.messageId);
      if (!message) {
        await interaction.editReply('Cannot fetch original confession message');
        return;
      }

      reply = {
        originalMessage: message,
      };
    }

    this.sendConfession({
      confession,
      confessor,
      isAnon,
      shouldPingArchons,
      shouldSkipMultiline,
      imageAttachment,
      imageLink,
      reply,
    }).catch(container.logger.error);

    await interaction.editReply({
      content: `Confession sent!\nCheck out ${channelMention(ChannelIds.CONFESSIONS)}`,
    });
  }

  public async sendConfession(options: SendConfessionArgs) {
    const {
      confession,
      confessor,
      isAnon,
      shouldPingArchons,
      shouldSkipMultiline,
      imageAttachment,
      imageLink,
      reply,
    } = options;

    const description = shouldSkipMultiline
      ? confession
      : GuildCommand.processConfession(confession);
    let components;
    let title = '**A New Confession!**';

    if (reply) {
      const OGConfessEmbed = reply.originalMessage.embeds[0];

      const OGAuthor = OGConfessEmbed.author?.name || 'Anonymous';

      title = `Replying to ${OGAuthor}`;

      components = [
        new ActionRowBuilder<ButtonBuilder>().addComponents([
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Go to original confession')
            .setURL(reply.originalMessage.url),
        ]),
      ];
    }

    const image: APIEmbed['image'] = {
      url: imageAttachment?.url || imageLink || '',
    };

    const anonEmbed: APIEmbed = {
      title,
      author: {
        name: 'Anonymous',
      },
      color: COLORS.EMBED_COLOR,
      description,
      image,
      timestamp: new Date().toISOString(),
    };

    const confessEmbed: APIEmbed = {
      title: anonEmbed.title,
      author: {
        name: confessor.nickname || confessor.user.tag,
        icon_url: confessor.displayAvatarURL(),
        url: `https://discord.com/users/${confessor.user.id}`,
      },
      color: anonEmbed.color,
      description,
      image,
      timestamp: anonEmbed.timestamp,
      thumbnail: {
        url: confessor.displayAvatarURL(),
      },
      footer: {
        text: `by - ${confessor.user.tag}`,
      },
    };

    const confessChannel = await this.container.client.channels.fetch(ChannelIds.CONFESSIONS);

    const logChannel = await serverLogChannel();

    if (!confessChannel?.isTextBased()) {
      throw new Error('Confession channel could not be fetched');
    }

    if (reply) {
      await reply.originalMessage
        .reply({
          content: shouldPingArchons ? roleMention(ROLE_IDS.OTHERS.ARCHONS) : undefined,
          embeds: [isAnon ? anonEmbed : confessEmbed],
          components,
        })
        .catch(container.logger.error);
    } else {
      await confessChannel
        .send({
          content: shouldPingArchons ? roleMention(ROLE_IDS.OTHERS.ARCHONS) : undefined,
          embeds: [isAnon ? anonEmbed : confessEmbed],
          components,
        })
        .catch(container.logger.error);
    }

    await logChannel
      .send({
        content: 'Confession log',
        embeds: [confessEmbed],
        files: [
          new AttachmentBuilder(
            Buffer.from(
              `Author: ${confessor.user.tag}\nID: ${
                confessor.user.id
              }\n\nRaw Confession:\n${confession}\n\nMedia: \n${imageLink} \n${imageAttachment}\n\nProcessed Confession:\n${GuildCommand.processConfession(
                confession,
              )}`,
              'utf8',
            ),
            {
              name: `Confession by ${confessor.user.tag} on ${new Date()}.txt`,
            },
          ),
        ],
        components,
      })
      .catch(container.logger.error);
  }
}
