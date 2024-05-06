import { LazyPaginatedMessage } from '@sapphire/discord.js-utilities';
import {
  type ChatInputCommandSuccessPayload,
  type Command,
  container,
  type ContextMenuCommandSuccessPayload,
  type MessageCommandSuccessPayload,
} from '@sapphire/framework';
import { chunk, deepClone, pickRandom } from '@sapphire/utilities';
import { cyan } from 'colorette';
import type {
  APIEmbed,
  APIUser,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Guild,
} from 'discord.js';
import { User } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import type { ELEMENTS } from '../typeDefs/typeDefs';
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

  return {
    shard,
    commandName,
    author,
    sentAt,
  };
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

interface PublishEmbedBuilderOption {
  users: User[];
  usersPerPage: number;
  embedTemplate: APIEmbed;
}
export async function publishEmbedsGenerator(
  options: PublishEmbedBuilderOption,
): Promise<Array<PublishEmbedBuilderOption['embedTemplate']>> {
  const { embedTemplate, users, usersPerPage } = options;
  return new Promise((resolve, reject) => {
    try {
      const chunks = chunk(users, usersPerPage);
      const embeds: Array<typeof embedTemplate> = [];
      chunks.forEach((piece) => {
        let value = '';
        const embed = deepClone(embedTemplate);
        embed.footer = {
          text: `${chunks.indexOf(piece) + 1} of ${chunks.length}`,
        };

        if (piece.length < 1) {
          value = '*No users found in this section...*';
        } else {
          piece.forEach((user) => {
            value = `${value}\n${user} - \`${user.tag}\``;
          });
        }

        embed.fields?.push({
          name: EMPTY_STRING,
          value: `${value}\n-`,
        });

        embeds.push(embed);
      });
      resolve(embeds);
    } catch (e) {
      reject(e);
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

export function getAbyssQuote() {
  return pickRandom(ABYSS_QUOTES);
}

export async function viewBook(book: APIEmbed[]) {
  const pg = new LazyPaginatedMessage();

  function addEmbed(embed: APIEmbed) {
    return pg.addAsyncPageBuilder(async (builder) => builder.setEmbeds([embed]));
  }

  await sequentialPromises(book, addEmbed);

  return async (interaction: ChatInputCommandInteraction | ButtonInteraction) =>
    pg.run(interaction);
}

export function parseTruthy(text: string) {
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

export function userLink(userOrID: User | User['id']) {
  const id = userOrID instanceof User ? userOrID.id : userOrID;

  return `https://discord.com/users/${id}`;
}

export function parseElement(element: string): ELEMENTS {
  const possibleElement = element.toLowerCase();

  switch (true) {
    case /\banemo\b/gimu.test(possibleElement):
      return 'anemo';

    case /\bgeo\b/gimu.test(possibleElement):
      return 'geo';

    case /\belectro\b/gimu.test(possibleElement):
      return 'electro';

    case /\bdendro\b/gimu.test(possibleElement):
      return 'dendro';

    case /\bhydro\b/gimu.test(possibleElement):
      return 'hydro';

    case /\bpyro\b/gimu.test(possibleElement):
      return 'pyro';

    case /\bcryo\b/gimu.test(possibleElement):
      return 'cryo';

    case /\bunaligned\b/gimu.test(possibleElement):
      return 'unaligned';

    case /\buni\b/gimu.test(possibleElement):
      return 'uni';

    default:
      throw new Error(`Invalid element type ${possibleElement}`);
  }
}
