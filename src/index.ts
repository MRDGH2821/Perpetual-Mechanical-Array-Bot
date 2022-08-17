import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import path from 'path';
import { setClusterClient } from './lib/BotClientExtracted';
import BotEvent from './lib/BotEvent';
import EnvConfig from './lib/EnvConfig';
import esmImporter from './lib/esmImporter';
import { Debugging, PMAEventHandler } from './lib/Utilities';

(async () => {
  const botEvents: BotEvent[] = [
    await esmImporter(path.resolve(__dirname, './pmaBaseModule/events/')),
    await esmImporter(path.resolve(__dirname, './leaderboardModule/events/')),
    await esmImporter(path.resolve(__dirname, './hallOfFameModule/events/')),
    await esmImporter(path.resolve(__dirname, './spiralAbyssModule/events/')),
  ].flat();

  const botCommands: InteractionCommand[] = [
    await esmImporter(path.resolve(__dirname, './pmaBaseModule/commands/')),
    await esmImporter(path.resolve(__dirname, './leaderboardModule/commands/')),
    await esmImporter(path.resolve(__dirname, './hallOfFameModule/commands/')),
    await esmImporter(path.resolve(__dirname, './spiralAbyssModule/commands/')),
  ].flat();

  const clusterBot = new ClusterClient(EnvConfig.token as string, {
    gateway: {
      intents: [
        GatewayIntents.GUILDS,
        GatewayIntents.GUILD_MEMBERS,
        GatewayIntents.GUILD_MESSAGES,
        GatewayIntents.GUILD_EMOJIS,
        GatewayIntents.GUILD_MESSAGE_REACTIONS,
        GatewayIntents.GUILD_MESSAGE_TYPING,
        GatewayIntents.GUILD_WEBHOOKS,
      ],
      loadAllMembers: true,
    },
    cache: {
      members: { enabled: true, limit: 10000 },
      guilds: { enabled: true, limit: 5 },
      roles: { enabled: true, limit: 1000 },
      users: { enabled: true, limit: 10000 },
      emojis: { enabled: true, limit: 10000 },
    },
  });

  botEvents.forEach((pmaEvent) => {
    if (pmaEvent.once) {
      clusterBot.once(pmaEvent.event, pmaEvent.listener);
      PMAEventHandler.once(pmaEvent.event, pmaEvent.listener);
    } else {
      clusterBot.subscribe(pmaEvent.event, pmaEvent.listener);
      PMAEventHandler.on(pmaEvent.event, pmaEvent.listener);
    }
  });

  await clusterBot.run();

  const interactionBot = new InteractionCommandClient(clusterBot);

  /*
  await interactionBot.rest.bulkOverwriteApplicationCommands(EnvConfig.clientId, []);
  await interactionBot.rest.bulkOverwriteApplicationGuildCommands(
    EnvConfig.clientId,
    EnvConfig.guildId,
    botCommands,
  );
  */

  interactionBot.addMultiple(botCommands);

  await interactionBot
    .run()
    .then(() => {
      setClusterClient(clusterBot);
      clusterBot.shards.first()?.guilds.get(EnvConfig.guildId)?.fetchMembers({ limit: 500 });
    })
    .catch((err) => {
      console.error(err);
      Debugging.leafDebug(err);
    });
})().catch((err) => {
  Debugging.leafDebug(err, true);
});
