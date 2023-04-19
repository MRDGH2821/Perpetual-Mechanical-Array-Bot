import type { Logger, MessageCommandSuccessPayload } from '@sapphire/framework';
import { Listener, LogLevel } from '@sapphire/framework';
import { logSuccessCommand } from '../../../lib/utils';

export default class MessageCommandSuccessEvent extends Listener {
  public run(payload: MessageCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
