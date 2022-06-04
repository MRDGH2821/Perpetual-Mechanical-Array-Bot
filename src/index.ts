import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import path from 'path';
import BotEvent from './lib/BotEvent';
import EnvConfig from './lib/EnvConfig';
import esmImporter from './lib/esmImporter';
import { Debugging, PMAEventHandler } from './lib/Utilities';

(async () => {
  const pmaEvents: Array<BotEvent> = await esmImporter(
    path.resolve(__dirname, './pmaBaseModule/events/'),
  );
  const leaderboardEvents: Array<BotEvent> = await esmImporter(
    path.resolve(__dirname, './leaderboardModule/events/'),
  );

  const botEvents = [pmaEvents, leaderboardEvents].flat();

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
    },
    cache: {
      members: { enabled: true, limit: 500 },
    },
  });

  botEvents.forEach((pmaEvent) => {
    if (pmaEvent.once) {
      clusterBot.once(pmaEvent.event, pmaEvent.listener);
    } else {
      clusterBot.subscribe(pmaEvent.event, pmaEvent.listener);
      PMAEventHandler.on(pmaEvent.event, pmaEvent.listener);
    }
  });

  await clusterBot.run();

  const interactionBot = new InteractionCommandClient(clusterBot);

  await interactionBot.addMultipleIn('./pmaBaseModule/commands/');
  await interactionBot.addMultipleIn('./leaderboardModule/commands/');

  await interactionBot.run().catch((err) => {
    console.error(err);
    Debugging.leafDebug(err);
  });
})().catch((err) => {
  Debugging.leafDebug(err, true);
});
