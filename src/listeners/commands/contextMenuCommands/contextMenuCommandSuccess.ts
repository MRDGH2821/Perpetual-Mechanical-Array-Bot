import type {
  ContextMenuCommandSuccessPayload,
  Logger,
} from "@sapphire/framework";
import { Listener, LogLevel } from "@sapphire/framework";
import { logSuccessCommand } from "../../../lib/utils.js";

export default class ContextMenuCommandSuccessEvent extends Listener {
  public run(payload: ContextMenuCommandSuccessPayload) {
    logSuccessCommand(payload);
  }

  public onLoad() {
    this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
    return super.onLoad();
  }
}
