import { ApplyOptions } from '@sapphire/decorators';
import { isGuildMember } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import {
  ActionRowBuilder,
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Attachment,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  channelMention,
  ComponentType,
  GuildMember,
  hyperlink,
  Message,
  MessageFlags,
  roleMention,
  TextInputStyle,
} from 'discord.js';
import { ChannelIds, COLORS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { customLogger } from '../../lib/utils';

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

@ApplyOptions<Command.Options>({
  name: 'confess',
  description: 'Wanna confess something?',
})
export default class GuildCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        dm_permission: false,
        dmPermission: false,
        type: ApplicationCommandType.ChatInput,
        options: [
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
        ],
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );

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

  public static parseTruthy(text: string) {
    const txt = text.toLowerCase();
    const truthyWords = ['y', 'true', 'yes'];
    let flag = false;
    truthyWords.forEach((word) => {
      if (word === txt) {
        flag = true;
      }
    });

    return flag;
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
        })
        .then((modalCtx) => {
          const confessionReply = modalCtx.fields.getTextInputValue('confession_reply');
          const anonymous = modalCtx.fields.getTextInputValue('anonymous');
          const pingArchons = modalCtx.fields.getTextInputValue('ping_archons');
          const imageLink = modalCtx.fields.getTextInputValue('image_link');
          const skipMultiline = modalCtx.fields.getTextInputValue('skip_multiline');

          const isAnon = GuildCommand.parseTruthy(anonymous);
          const shouldPingArchons = GuildCommand.parseTruthy(pingArchons);
          const shouldSkipMultiline = GuildCommand.parseTruthy(skipMultiline);
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
        .catch(this.container.logger.error);
    } else {
      await interaction.reply({
        content: 'Cannot reply to random message outside confession channel',
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const confession = interaction.options.getString('confession', true);
    const shouldSkipMultiline = interaction.options.getBoolean('skip_multiline') || false;
    const isAnon = interaction.options.getBoolean('anonymous') || false;
    const shouldPingArchons = interaction.options.getBoolean('ping_archons') || false;
    const imageAttachment = interaction.options.getAttachment('image_upload');
    const imageLink = interaction.options.getString('image_link');

    const confessor = interaction.member;

    if (!isGuildMember(confessor)) {
      throw new Error('Cannot fetch Member');
    }

    this.sendConfession({
      confession,
      confessor,
      isAnon,
      shouldPingArchons,
      shouldSkipMultiline,
      imageAttachment,
      imageLink,
    }).catch(customLogger.error);

    return interaction.reply({
      content: `Confession sent!\nCheck out ${channelMention(ChannelIds.CONFESSIONS)}`,
      flags: MessageFlags.Ephemeral,
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

    let description = shouldSkipMultiline ? confession : GuildCommand.processConfession(confession);
    let components;
    if (reply) {
      const OGConfessEmbed = reply.originalMessage.embeds[0];

      const OGAuthor = OGConfessEmbed.author?.name || 'Anonymous';

      const OGConfession = hyperlink('See here', reply.originalMessage.url);

      const newDescription = `\`${OGAuthor}\` says: ${OGConfession}\n\nReply:\n`;
      description = newDescription + description;
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
      title: '**A New Confession!**',
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

    const logChannel = await this.container.client.channels.fetch(ChannelIds.ARCHIVES);

    if (!confessChannel?.isTextBased()) {
      throw new Error('Confession channel could not be fetched');
    }

    if (!logChannel?.isTextBased()) {
      throw new Error('Archives channel could not be fetched');
    }

    const logger = customLogger;
    await confessChannel
      .send({
        content: shouldPingArchons ? roleMention(ROLE_IDS.OTHERS.ARCHONS) : undefined,
        embeds: [isAnon ? anonEmbed : confessEmbed],
        components,
      })
      .catch(logger.error);

    await logChannel
      .send({
        content: 'Confession log',
        embeds: [confessEmbed],
        files: [
          new AttachmentBuilder(
            `Author: ${confessor.user.tag}\nID: ${
              confessor.user.id
            }\n\nRaw Confession:\n${confession}\n\nMedia: \n${imageLink} \n${imageAttachment}\n\nProcessed Confession:\n${GuildCommand.processConfession(
              confession,
            )}`,
            {
              name: `Confession by ${confessor.user.tag} on ${new Date()}.txt`,
            },
          ),
        ],
      })
      .catch(logger.error);
  }
}
