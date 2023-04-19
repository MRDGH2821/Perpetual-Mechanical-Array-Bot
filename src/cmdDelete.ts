import { LogLevel } from '@sapphire/framework';
import { Client, GatewayIntentBits } from 'discord.js';

async function deleteAllCommands() {
  const bot = new Client({
    defaultPrefix: 'pma!',
    caseInsensitiveCommands: true,
    logger: {
      level: LogLevel.Debug,
    },
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
    ],
    loadMessageCommandListeners: true,
  });
  await bot.login(process.env.DISCORD_TOKEN);

  const { rest } = bot;

  bot.logger.info('Login Successful');
  const { GUILD_ID, CLIENT_ID } = process.env;
  await rest
    .put(`/applications/${CLIENT_ID!}/guilds/${GUILD_ID!}/commands`, { body: [] })
    .then(() => bot.logger.info('Deleted guild commands'));
  await rest
    .put(`/applications/${CLIENT_ID!}/commands`, { body: [] })
    .then(() => bot.logger.info('Deleted global commands'));

  process.exit(0);
}

deleteAllCommands();
