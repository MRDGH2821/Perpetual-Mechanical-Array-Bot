import { env } from "custom-env";
env("dev");

export const configuration = {
  clientId: process.env.CLIENTID,
  guildId: process.env.GUILDID,
  token: process.env.TOKEN
};
