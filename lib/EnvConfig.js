import { env } from 'custom-env';

env('dev');

const EnvConfig = {
  clientId: process.env.CLIENTID,
  guildId: process.env.GUILDID,
  token: process.env.TOKEN,
};

export default EnvConfig;
