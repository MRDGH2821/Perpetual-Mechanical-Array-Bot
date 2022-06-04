import { Constants } from 'detritus-client';
import { BotEventOptions } from '../botTypes/interfaces';

export default class BotEvent {
  event: Constants.ClientEvents | Constants.GatewayDispatchEvents | string = '';

  on?: boolean = true;

  once?: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listener(...args: any): any {
    console.log(`"${this.event}" listener ready!`);
  }

  constructor(data: BotEventOptions) {
    this.event = data.event;
    if (data.once) {
      this.once = true;
    } else {
      this.on = true;
    }

    this.listener = data.listener;
  }
}
