import { Constants } from 'detritus-client';

export interface IEvent {
  event: Constants.ClientEvents;
  on?: boolean;
  once?: boolean;
  listener(payload?: any): any;
}
