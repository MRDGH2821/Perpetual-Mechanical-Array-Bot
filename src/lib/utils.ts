import {
  container,
  type ChatInputCommandSuccessPayload,
  type Command,
  type ContextMenuCommandSuccessPayload,
  type MessageCommandSuccessPayload,
} from '@sapphire/framework';
import { deepClone } from '@sapphire/utilities';
import { cyan } from 'colorette';
import type { APIEmbed, APIUser, Guild, User } from 'discord.js';
import { getClient } from './ClientExtractor';
import { EMPTY_STRING } from './Constants';

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
            value = `${value}\n${user} - \`${user.username}\``;
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
