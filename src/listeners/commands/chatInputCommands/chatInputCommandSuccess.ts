import {
  Listener,
  Logger,
  LogLevel,
  type ChatInputCommandSuccessPayload,
} from '@sapphire/framework';
import { logSuccessCommand } from '../../../lib/utils';

export default class ChatInputCommandSuccessEvent extends Listener {
  public run(payload: ChatInputCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
