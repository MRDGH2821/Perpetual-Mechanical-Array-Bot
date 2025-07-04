import type {
  ChatInputCommandSuccessPayload,
  Logger,
} from "@sapphire/framework";
import { Listener, LogLevel } from "@sapphire/framework";
import { logSuccessCommand } from "../../../lib/utils.js";

export default class ChatInputCommandSuccessEvent extends Listener {
  public run(payload: ChatInputCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
