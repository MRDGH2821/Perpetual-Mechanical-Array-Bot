import { ApplyOptions } from '@sapphire/decorators';
import { Listener, container, type ListenerOptions } from '@sapphire/framework';
import { AttachmentBuilder, time } from 'discord.js';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import { ChannelIds } from '../../lib/Constants';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  event: 'SABackup',
  name: 'Spiral Abyss Roles Backup maker',
})
export default class SABackup extends Listener {
  public async run() {
    await SpiralAbyssCache.prepareCache();

    const backup = SpiralAbyssCache.exportCacheBackup();

    const date = new Date();

    const bkpFiles: AttachmentBuilder[] = [
      new AttachmentBuilder(Buffer.from(JSON.stringify(backup.traveler)), {
        name: `Abyssal Traveler ${date.toUTCString()}_.json`,
      }),
      new AttachmentBuilder(Buffer.from(JSON.stringify(backup.conqueror)), {
        name: `Abyssal Conqueror ${date.toUTCString()}_.json`,
      }),
      new AttachmentBuilder(Buffer.from(JSON.stringify(backup.sovereign)), {
        name: `Abyssal Sovereign ${date.toUTCString()}_.json`,
      }),
    ];

    const channel = await container.client.channels.fetch(ChannelIds.ARCHIVES);

    if (!channel?.isTextBased()) {
      throw new Error('Need Text based channel to send Spiral Abyss Cache Backup');
    }

    channel.send({
      content: `Backup made on ${time(date, 'F')} (${time(date, 'R')})`,
      files: bkpFiles,
    });
  }
}
