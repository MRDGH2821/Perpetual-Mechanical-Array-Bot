if (process.env.GUILD_ID === undefined) {
  throw new Error('Guild ID not defined');
}

if (process.env.DISCORD_TOKEN === undefined) {
  throw new Error('Token not defined');
}

const EnvConfig = {
  guildId: process.env.GUILD_ID,
  token: process.env.DISCORD_TOKEN,
};

export default EnvConfig;
