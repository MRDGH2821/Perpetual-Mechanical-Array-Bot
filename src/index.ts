import { ClusterClient, InteractionCommandClient } from 'detritus-client';
import { GatewayIntents } from 'detritus-client-socket/lib/constants';
import EnvConfig from './lib/EnvConfig';
import esmImporter from './lib/esmImporter';
import { IEvent } from './types/interfaces';

(async () => {
  const pmaEvents: Array<IEvent> = await esmImporter('./src/pmaBaseModule/events');

  const clusterBot = new ClusterClient(EnvConfig.token as string, {
    gateway: {
      intents: [GatewayIntents.GUILDS, GatewayIntents.GUILD_MEMBERS, GatewayIntents.GUILD_MESSAGES],
    },
    cache: {
      members: { enabled: true, limit: 500 },
    },
  });

  pmaEvents.forEach((pmaEvent) => {
    if (pmaEvent.once) {
      clusterBot.once(pmaEvent.event, (...args) => pmaEvent.listener(...args));
    } else {
      clusterBot.on(pmaEvent.event, (...args) => pmaEvent.listener(...args));
    }
  });

  await clusterBot.run();

  const interactionBot = new InteractionCommandClient(clusterBot);

  await interactionBot.addMultipleIn('./pmaBaseModule');

  await interactionBot.run();
})();
