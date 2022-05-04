import { Constants } from 'detritus-client';

export interface IEvent {
  name: Constants.ClientEvents;
  on?: boolean;
  once?: boolean;
  run(payload?: any): any;
}
