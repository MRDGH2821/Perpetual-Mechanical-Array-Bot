import EnvConfig from '@pma-lib/EnvConfig';
import esmImporter from '@pma-lib/esmImporter';
import { IEvent } from '@pma-types/interfaces';
import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';

(async () => {
  const pmaEvents: Array<IEvent> = await esmImporter('./src/pmaBaseModule/events');
  const leaderboardEvents: Array<IEvent> = await esmImporter('./src/leaderboardModule/events/');

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
      ],
    },
    cache: {
      members: { enabled: true, limit: 500 },
    },
  });

  botEvents.forEach((pmaEvent) => {
    if (pmaEvent.once) {
      clusterBot.once(pmaEvent.event, (...args) => pmaEvent.listener(...args));
    } else {
      clusterBot.on(pmaEvent.event, (...args) => pmaEvent.listener(...args));
    }
  });

  await clusterBot.run();

  const interactionBot = new InteractionCommandClient(clusterBot);

  await interactionBot.addMultipleIn('./pmaBaseModule');
  await interactionBot.addMultipleIn('./leaderboardModule/commands/');

  await interactionBot.run().catch((error) => console.log(JSON.stringify(error, null, 2)));
})();
