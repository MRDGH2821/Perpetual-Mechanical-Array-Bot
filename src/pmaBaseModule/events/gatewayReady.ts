import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import { setRestClient, setShardClient } from '../../lib/BotClientExtracted';
import BotEvent from '../../lib/BotEvent';
import EnvConfig from '../../lib/EnvConfig';
import { PMAEventHandler } from '../../lib/Utilities';

export default new BotEvent({
  event: ClientEvents.GATEWAY_READY,
  once: true,
  async listener(args) {
    const clusterShard: GatewayClientEvents.ClusterEvent['shard'] = args.shard;
    const gatewayRaw: GatewayClientEvents.GatewayReady['raw'] = args.raw;
    console.log(`Ready! Logged in as ${gatewayRaw.user.username}#${gatewayRaw.user.discriminator}`);

    console.log(
      'Guild commands: ',
      await clusterShard.rest.fetchApplicationGuildCommands(
        clusterShard.applicationId,
        EnvConfig.guildId as string,
      ),
    );

    console.log(
      'Global commands: ',
      await clusterShard.rest.fetchApplicationCommands(clusterShard.applicationId),
    );

    setRestClient(clusterShard.rest);
    setShardClient(clusterShard);

    setTimeout(() => {
      PMAEventHandler.emit('leaderboardRefresh');
      PMAEventHandler.emit('hallOfFameRefresh');
      PMAEventHandler.emit('spiralAbyssRefresh');
      PMAEventHandler.emit('quotesRefresh');
      PMAEventHandler.emit('removeRNGFreezeMute');
    }, 1000 * 5);
  },
});
