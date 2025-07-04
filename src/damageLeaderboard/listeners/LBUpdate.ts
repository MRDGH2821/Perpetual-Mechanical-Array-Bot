import { ApplyOptions } from "@sapphire/decorators";
import { Listener } from "@sapphire/framework";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import db from "../../lib/Database/Firestore.js";
import LeaderboardCache from "../lib/LeaderboardCache.js";

@ApplyOptions<Listener.Options>({
  emitter: PMAEventHandler,
  enabled: true,
  event: "LBUpdate",
  name: "Leaderboard Summary Channel Updater",
})
export default class LBUpdate extends Listener {
  public override async run() {
    const anemoSkillBoard =
      await LeaderboardCache.generateSummaryEmbed("anemo");
    const geoSkillBoard = await LeaderboardCache.generateSummaryEmbed("geo");
    const electroSkillBoard =
      await LeaderboardCache.generateSummaryEmbed("electro");
    const dendroSkillBoard =
      await LeaderboardCache.generateSummaryEmbed("dendro");
    const hydroSkillBoard =
      await LeaderboardCache.generateSummaryEmbed("hydro");
    const uniSkillBoard = await LeaderboardCache.generateSummaryEmbed("uni");

    const leaderboardDB = db.collection("leaderboards");

    const anemoMsg = (await leaderboardDB.doc("anemo-dmg-skill").get()).data();
    const geoMsg = (await leaderboardDB.doc("geo-dmg-skill").get()).data();
    const electroMsg = (
      await leaderboardDB.doc("electro-dmg-skill").get()
    ).data();
    const dendroMsg = (
      await leaderboardDB.doc("dendro-dmg-skill").get()
    ).data();
    const hydroMsg = (await leaderboardDB.doc("hydro-dmg-skill").get()).data();
    const uniMsg = (await leaderboardDB.doc("uni-dmg-n5").get()).data();
    const webhookMsg = (await leaderboardDB.doc("webhook").get()).data() as {
      channelID: string;
      webhookID: string;
    };

    const leaderboardHook = await this.container.client.fetchWebhook(
      webhookMsg.webhookID,
    );
    await Promise.all([
      leaderboardHook
        .editMessage(anemoMsg?.messageID, { embeds: [anemoSkillBoard] })
        .catch((error) => {
          this.container.logger.fatal("Anemo leaderboard update failed");
          this.container.logger.error(error);
        }),
      leaderboardHook
        .editMessage(geoMsg?.messageID, { embeds: [geoSkillBoard] })
        .catch((error) => {
          this.container.logger.fatal("Geo leaderboard update failed");
          this.container.logger.error(error);
        }),
      leaderboardHook
        .editMessage(electroMsg?.messageID, { embeds: [electroSkillBoard] })
        .catch((error) => {
          this.container.logger.fatal("Electro leaderboard update failed");
          this.container.logger.error(error);
        }),
      leaderboardHook
        .editMessage(dendroMsg?.messageID, { embeds: [dendroSkillBoard] })
        .catch((error) => {
          this.container.logger.fatal("Dendro leaderboard update failed");
          this.container.logger.error(error);
        }),
      leaderboardHook
        .editMessage(hydroMsg?.messageID, { embeds: [hydroSkillBoard] })
        .catch((error) => {
          this.container.logger.fatal("Hydro leaderboard update failed");
          this.container.logger.error(error);
        }),
      leaderboardHook
        .editMessage(uniMsg?.messageID, { embeds: [uniSkillBoard] })
        .catch((error) => {
          this.container.logger.fatal("Uni leaderboard update failed");
          this.container.logger.error(error);
        }),
    ])
      .then(() =>
        this.container.logger.info("Leaderboard summary channel updated!"),
      )
      .catch(this.container.logger.error);
  }
}
