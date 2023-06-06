import { ApplyOptions } from '@sapphire/decorators';
import { FetchResultTypes, fetch } from '@sapphire/fetch';
import { Listener, container, type ListenerOptions } from '@sapphire/framework';
import { Attachment, User } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import { COLORS, ChannelIds, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';
import type { BackupCacheFileType } from '../typeDefs/spiralAbyssTypes';

type SpiralAbyssRestoreArgs = {
  backupFile: Attachment;
  user: User;
};

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'SARestore',
  name: 'Spiral Abyss Roles Restorer',
})
export default class SARestore extends Listener {
  public async run(args: SpiralAbyssRestoreArgs) {
    const tvmGuild = await container.client.guilds.fetch(EnvConfig.guildId);
    const archivesChannel = await tvmGuild.channels.fetch(ChannelIds.ARCHIVES);

    container.logger.debug(args.backupFile);
    const fileContent = await fetch<Partial<BackupCacheFileType>>(
      args.backupFile.url,
      FetchResultTypes.JSON,
    );

    const getMember = (id: string) => tvmGuild.members.fetch(id);

    const assignRole = (roleId: ROLE_IDS.SpiralAbyss, userId: string) =>
      getMember(userId).then((member) => member.roles.add(roleId));

    let countTraveler = 0;
    let countConqueror = 0;
    let countSovereign = 0;

    if (fileContent.traveler) {
      const assignTraveler = (userId: string) =>
        assignRole(ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER, userId)
          .then(() => {
            countTraveler += 1;
          })
          .catch(container.logger.error);

      await sequentialPromises(fileContent.traveler, assignTraveler);
    }

    if (fileContent.conqueror) {
      const assignConqueror = (userId: string) =>
        assignRole(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR, userId)
          .then(() => {
            countConqueror += 1;
          })
          .catch(container.logger.error);

      await sequentialPromises(fileContent.conqueror, assignConqueror);
    }

    if (fileContent.sovereign) {
      const assignSovereign = (userId: string) =>
        assignRole(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN, userId)
          .then(() => {
            countSovereign += 1;
          })
          .catch(container.logger.error);

      await sequentialPromises(fileContent.sovereign, assignSovereign);
    }

    await SpiralAbyssCache.prepareCache();

    if (!archivesChannel?.isTextBased()) {
      throw new Error('Need Text based channel to send Spiral Abyss role restore status');
    }

    await archivesChannel.send({
      content: args.user.toString(),
      embeds: [
        {
          title: 'Spiral Abyss Roles restore statistics',
          color: COLORS.EMBED_COLOR,
          description: 'Results of restoring backup',
          fields: [
            {
              name: 'Backup File Statistics',
              value: `**Traveler**: ${fileContent.traveler?.length}\n**Conqueror**: ${fileContent.conqueror?.length}\n**Sovereign**: ${fileContent.sovereign?.length}`,
            },
            {
              name: 'Successful Restore Statistics',
              value: `**Traveler**: ${countTraveler}\n**Conqueror**: ${countConqueror}\n**Sovereign**: ${countSovereign}`,
            },
            {
              name: 'Reality (The actual stat to look for)',
              value: `**Traveler**: ${
                SpiralAbyssCache.accessCache('traveler').size
              }\n**Conqueror**: ${SpiralAbyssCache.accessCache('conqueror').size}\n**Sovereign**: ${
                SpiralAbyssCache.accessCache('sovereign').size
              }`,
            },
          ],
        },
      ],
    });
  }
}
