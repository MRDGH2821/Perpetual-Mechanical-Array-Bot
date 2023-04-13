import {
  container,
  type ChatInputCommandSuccessPayload,
  type Command,
  type ContextMenuCommandSuccessPayload,
  type MessageCommandSuccessPayload,
} from '@sapphire/framework';
import { Time } from '@sapphire/time-utilities';
import { deepClone, pickRandom } from '@sapphire/utilities';
import { cyan } from 'colorette';
import {
  ActionRowBuilder,
  APIEmbed,
  APIUser,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  Guild,
  MessageFlags,
  User,
} from 'discord.js';
import { getClient } from './ClientExtractor';
import { ChannelIds, EMPTY_STRING } from './Constants';
import { ABYSS_QUOTES } from './DynamicConstants';
import EnvConfig from './EnvConfig';

function getShardInfo(id: number) {
  return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
  return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
  return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
  if (guild === null) return 'Direct Messages';
  return `${guild.name}[${cyan(guild.id)}]`;
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
  const shard = getShardInfo(guild?.shardId ?? 0);
  const commandName = getCommandInfo(command);
  const author = getAuthorInfo(user);
  const sentAt = getGuildInfo(guild);

  return { shard, commandName, author, sentAt };
}

export function logSuccessCommand(
  payload:
    | ContextMenuCommandSuccessPayload
    | ChatInputCommandSuccessPayload
    | MessageCommandSuccessPayload,
): void {
  const successLoggerData: ReturnType<typeof getSuccessLoggerData> =
    'interaction' in payload
      ? getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command)
      : getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);

  container.logger.debug(
    `${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`,
  );
}

export async function getUser(id: User['id']) {
  const client = getClient();

  return client.users.fetch(id);
}

export function chunksGenerator<T>(array: T[], size: number) {
  const result = [];
  const copy = [...array];
  while (copy.length > 0) {
    result.push(copy.splice(0, size));
  }
  return result;
}

type PublishEmbedBuilderOption = {
  users: User[];
  usersPerPage: number;
  embedTemplate: APIEmbed;
};
export function publishEmbedsGenerator(
  options: PublishEmbedBuilderOption,
): Promise<PublishEmbedBuilderOption['embedTemplate'][]> {
  const { embedTemplate, users, usersPerPage } = options;
  return new Promise((res, rej) => {
    try {
      const chunks = chunksGenerator(users, usersPerPage);
      const embeds: (typeof embedTemplate)[] = [];
      chunks.forEach((chunk) => {
        let value = '';
        const embed = deepClone(embedTemplate);
        embed.footer = {
          text: `${chunks.indexOf(chunk) + 1} of ${chunks.length}`,
        };

        if (chunk.length < 1) {
          value = '*No users found in this section...*';
        } else {
          chunk.forEach((user) => {
            value = `${value}\n${user} - \`${user.tag}\``;
          });
        }

        embed.fields?.push({
          name: EMPTY_STRING,
          value: `${value}\n-`,
        });

        embeds.push(embed);
      });
      res(embeds);
    } catch (e) {
      rej(e);
    }
  });
}

export async function serverLogChannel() {
  const tvmServer = await container.client.guilds.fetch(EnvConfig.guildId);

  const logChannel = await tvmServer.channels.fetch(ChannelIds.ARCHIVES);

  if (!logChannel?.isTextBased()) {
    throw new Error('Cannot fetch log channel');
  }

  return logChannel;
}

function getAbyssQuote() {
  return pickRandom(ABYSS_QUOTES);
}

export async function viewPages(embeds: APIEmbed[]) {
  return async function next(
    ctx: ChatInputCommandInteraction | ButtonInteraction,
    i = 0,
  ): Promise<any | void> {
    if (embeds.length < 1) {
      return ctx.editReply({
        content: 'No users found for given category',
      });
    }
    const msg = await ctx.editReply({
      content: embeds[i] ? undefined : getAbyssQuote(),
      embeds: [embeds[i]],
      options: {
        flags: MessageFlags.Ephemeral,
      },
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              label: 'Previous',
              emoji: '⬅️',
              style: ButtonStyle.Secondary,
            }).setCustomId('go_previous'),
            new ButtonBuilder({
              label: 'Next',
              emoji: '➡️',
              style: ButtonStyle.Primary,
            }).setCustomId('go_next'),
          ],
        }),
      ],
    });

    return msg
      .awaitMessageComponent({
        componentType: ComponentType.Button,
        dispose: true,
        time: Time.Minute,
      })
      .then((button) => {
        if (button.customId === 'go_next') {
          return next(button, i < embeds.length ? i + 1 : i);
        }
        return next(button, i >= 0 ? i - 1 : i);
      });
  };
}
