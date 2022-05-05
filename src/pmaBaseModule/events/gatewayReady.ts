import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import { IEvent } from '../../types/interfaces';

const gatewayReady: IEvent = {
  event: ClientEvents.READY,
  once: true,
  async listener(args: GatewayClientEvents.GatewayReady) {
    console.log(`Logged in as ${args.raw.user.username}`);
  },
};

export default gatewayReady;
