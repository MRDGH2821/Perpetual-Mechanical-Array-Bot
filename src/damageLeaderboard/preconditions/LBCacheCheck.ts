import { Precondition } from "@sapphire/framework";
import LeaderboardCache from "../lib/LeaderboardCache.js";

export default class LBCacheCheck extends Precondition {
  public override chatInputRun() {
    return this.validate();
  }

  public override contextMenuRun() {
    return this.validate();
  }

  public validate() {
    return LeaderboardCache.isCacheReady()
      ? this.ok()
      : this.error({
          context: "Hall of Fame cache not ready",
          message:
            "Please wait before using Hall of fame commands as cache is not ready",
        });
  }
}

declare module "@sapphire/framework" {
  type Preconditions = {
    LBCacheCheck: never;
  }
}
