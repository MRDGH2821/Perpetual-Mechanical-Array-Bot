import { ApplyOptions } from '@sapphire/decorators';
import { isGuildMember } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import {
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  AttachmentBuilder,
  MessageFlags,
  roleMention,
} from 'discord.js';
import { ChannelIds, COLORS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';

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
  }

  public static processConfession(confession: string) {
    return confession.replaceAll('\\n', '\n');
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const confession = interaction.options.getString('confession', true);
    const shouldSkipMultiline = interaction.options.getBoolean('skip_multiline') || false;
    const isAnon = interaction.options.getBoolean('anonymous') || false;
    const shouldPingArchons = interaction.options.getBoolean('ping_archons') || false;
    const imageAttachment = interaction.options.getAttachment('image_upload');
    const imageLink = interaction.options.getString('image_link');

    const confessor = interaction.member;
    const { logger } = this.container.client;

    if (!isGuildMember(confessor)) {
      throw new Error('Cannot fetch Member');
    }

    const description = shouldSkipMultiline
      ? confession
      : GuildCommand.processConfession(confession);
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
        name: confessor.nickname || confessor.user.username,
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
        text: `by - ${confessor.user.username}`,
      },
    };

    const confessChannel = await interaction.client.channels.fetch(ChannelIds.CONFESSIONS);

    const logChannel = await interaction.client.channels.fetch(ChannelIds.ARCHIVES);

    if (!confessChannel?.isTextBased()) {
      throw new Error('Confession channel could not be fetched');
    }

    if (!logChannel?.isTextBased()) {
      throw new Error('Archives channel could not be fetched');
    }

    await confessChannel
      .send({
        content: shouldPingArchons ? roleMention(ROLE_IDS.OTHERS.ARCHONS) : undefined,
        embeds: [isAnon ? anonEmbed : confessEmbed],
      })
      .catch(logger.error);

    await logChannel
      .send({
        content: 'Confession log',
        embeds: [confessEmbed],
        files: [
          new AttachmentBuilder(
            `Author: ${confessor.user.username}\nID: ${
              confessor.user.id
            }\n\nRaw Confession:\n${confession}\n\nMedia: \n${imageLink} \n${imageAttachment}\n\nProcessed Confession:\n${GuildCommand.processConfession(
              confession,
            )}`,
            {
              name: `Confession by ${confessor.user.username} on ${new Date()}.txt`,
            },
          ),
        ],
      })
      .catch(logger.error);

    return interaction.reply({
      content: `Confession sent!\nCheck out ${confessChannel}`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
