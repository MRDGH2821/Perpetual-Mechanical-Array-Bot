import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Client, GatewayIntentBits } from 'discord.js';
import './lib/setup';

const client = new SapphireClient({
  defaultPrefix: '!',
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  console.log('Login Successful');
  const { GUILD_ID, CLIENT_ID } = process.env;
  await rest
    .put(`/applications/${CLIENT_ID!}/guilds/${GUILD_ID!}/commands`, { body: [] })
    .then(() => console.log('Deleted guild commands'));
  await rest
    .put(`/applications/${CLIENT_ID!}/commands`, { body: [] })
    .then(() => console.log('Deleted global commands'));

  process.exit(0);
}

const main = async () => {
  try {
    client.logger.info('Logging in');
    await client.login();
    client.logger.info('logged in');
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();

// deleteAllCommands()
