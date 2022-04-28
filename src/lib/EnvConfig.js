import { env } from 'custom-env';

env('dev');

const EnvConfig = {
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  token: process.env.TOKEN,
};

export default EnvConfig;
