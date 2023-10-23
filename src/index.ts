import { join } from 'node:path';
import { LogLevel, SapphireClient } from '@sapphire/framework';
import { getRootData } from '@sapphire/pieces';
import type { ClientOptions } from 'discord.js';
import { GatewayIntentBits, Partials } from 'discord.js';
import './lib/setup';
import './scheduledTasks';
import './healthInfo';
import { cred } from './lib/Firestore';

class CustomClient extends SapphireClient {
  private rootData = getRootData();

  public constructor(options: ClientOptions) {
    super(options);
    this.stores.registerPath(join(this.rootData.root, 'baseBot'));
    this.stores.registerPath(join(this.rootData.root, 'hallOfFame'));
    this.stores.registerPath(join(this.rootData.root, 'spiralAbyss'));
    this.stores.registerPath(join(this.rootData.root, 'damageLeaderboard'));
  }
}

const client = new CustomClient({
  defaultPrefix: 'pma!',
  caseInsensitiveCommands: true,
  logger: {
    level: LogLevel.Debug,
  },
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message],
  loadMessageCommandListeners: true,
});

const main = async () => {
  try {
    if (!cred.cert && !cred.path) {
      throw new Error('Cannot find Firebase credentials');
    }
    client.logger.info('Logging in');
    await client.login();
    client.logger.info('Logged in');
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();
