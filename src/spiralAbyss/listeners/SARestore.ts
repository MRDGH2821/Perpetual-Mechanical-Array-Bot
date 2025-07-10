import { ApplyOptions } from "@sapphire/decorators";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import type { Attachment, User } from "discord.js";
import { sequentialPromises } from "yaspr";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import { ChannelIds, COLORS, ROLE_IDS } from "../../lib/Constants.js";
import EnvConfig from "../../lib/EnvConfig.js";
import type { ValueOf } from "../../typeDefs/typeDefs.js";
import SpiralAbyssCache from "../lib/SpiralAbyssCache.js";
import type { BackupCacheFileType } from "../typeDefs/spiralAbyssTypes.js";

type SpiralAbyssRestoreArgs = {
  backupFile: Attachment;
  user: User;
};

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: "SARestore",
  name: "Spiral Abyss Roles Restorer",
})
export default class SARestore extends Listener {
  public async run(args: SpiralAbyssRestoreArgs) {
    const tvmGuild = await this.container.client.guilds.fetch(
      EnvConfig.guildId,
    );
    const archivesChannel = await tvmGuild.channels.fetch(ChannelIds.ARCHIVES);

    this.container.logger.debug(args.backupFile);
    const fileContent = await fetch<Partial<BackupCacheFileType>>(
      args.backupFile.url,
      FetchResultTypes.JSON,
    );

    const getMember = async (id: string) => tvmGuild.members.fetch(id);

    async function assignRole(
      roleId: ValueOf<typeof ROLE_IDS.SPIRAL_ABYSS>,
      userId: string,
    ) {
      return getMember(userId).then(async (member) => member.roles.add(roleId));
    }

    let countTraveler = 0;
    let countConqueror = 0;
    let countSovereign = 0;

    const { ABYSSAL_CONQUEROR, ABYSSAL_SOVEREIGN, ABYSSAL_TRAVELER } =
      ROLE_IDS.SPIRAL_ABYSS;

    if (fileContent.traveler) {
      const assignTraveler = async (userId: string) =>
        assignRole(ABYSSAL_TRAVELER, userId)
          .then(() => {
            countTraveler += 1;
          })
          .catch((error) => this.container.logger.error(error));

      await sequentialPromises(fileContent.traveler, assignTraveler);
    }

    if (fileContent.conqueror) {
      const assignConqueror = async (userId: string) =>
        assignRole(ABYSSAL_CONQUEROR, userId)
          .then(() => {
            countConqueror += 1;
          })
          .catch((error) => this.container.logger.error(error));

      await sequentialPromises(fileContent.conqueror, assignConqueror);
    }

    if (fileContent.sovereign) {
      const assignSovereign = async (userId: string) =>
        assignRole(ABYSSAL_SOVEREIGN, userId)
          .then(() => {
            countSovereign += 1;
          })
          .catch((error) => this.container.logger.error(error));

      await sequentialPromises(fileContent.sovereign, assignSovereign);
    }

    await SpiralAbyssCache.prepareCache();

    if (!archivesChannel?.isTextBased()) {
      throw new Error(
        "Need Text based channel to send Spiral Abyss role restore status",
      );
    }

    await archivesChannel.send({
      content: args.user.toString(),
      embeds: [
        {
          title: "Spiral Abyss Roles restore statistics",
          color: COLORS.EMBED_COLOR,
          description: "Results of restoring backup",
          fields: [
            {
              name: "Backup File Statistics",
              value: `**Traveler**: ${fileContent.traveler?.length}\n**Conqueror**: ${fileContent.conqueror?.length}\n**Sovereign**: ${fileContent.sovereign?.length}`,
            },
            {
              name: "Successful Restore Statistics",
              value: `**Traveler**: ${countTraveler}\n**Conqueror**: ${countConqueror}\n**Sovereign**: ${countSovereign}`,
            },
            {
              name: "Reality (The actual stat to look for)",
              value: `**Traveler**: ${
                SpiralAbyssCache.accessCache("traveler").size
              }\n**Conqueror**: ${SpiralAbyssCache.accessCache("conqueror").size}\n**Sovereign**: ${
                SpiralAbyssCache.accessCache("sovereign").size
              }`,
            },
          ],
        },
      ],
    });
  }
}
