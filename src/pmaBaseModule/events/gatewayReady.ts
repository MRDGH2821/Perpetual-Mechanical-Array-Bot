import { GatewayClientEvents } from 'detritus-client';
import { ClientEvents } from 'detritus-client/lib/constants';
import { IEvent } from '../../types/interfaces';

const gatewayReady: IEvent = {
  name: ClientEvents.READY,
  async run(args: GatewayClientEvents.GatewayReady) {
    console.log(`Logged in as ${args.raw.user.username}`);
  },
};

export default gatewayReady;
