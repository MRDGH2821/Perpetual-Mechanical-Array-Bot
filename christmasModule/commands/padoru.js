import {
  channelMention,
  roleMention,
  SlashCommandBuilder
} from '@discordjs/builders';
import { Command } from '@ruinguard/core';
import { CHANNEL_IDS, EMOJIS, ROLE_IDS } from '../../lib/Constants.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('padoru')
    .setDescription('Will sing Padoru (as text)'),

  async run(interaction) {
    const allowedChannels = [
      CHANNEL_IDS.botSpam,
      CHANNEL_IDS.commandCenter,
      CHANNEL_IDS.musicBotSpam,
      CHANNEL_IDS.pingCelestia,
    ];
    const { channel } = interaction;
    if (allowedChannels.includes(channel.id)) {
      await interaction.reply({
        content: `Merry Christmas ${interaction.user.tag}!`,
      });

      await channel.send(`${roleMention(ROLE_IDS.archons)} Hashire sori yo`);
      await channel.send(`${roleMention(ROLE_IDS.archons)} Kazeno yuu ni`);
      await channel.send(`${roleMention(ROLE_IDS.archons)} Tsukkimihara wo`);
      await channel.send(`${roleMention(ROLE_IDS.archons)} PADORU PADORU`);
      await channel.send(
        `${EMOJIS.LuminePadoru}${EMOJIS.LuminePadoru}${EMOJIS.LuminePadoru}${EMOJIS.LuminePadoru}`,
      );
      await channel.send({ stickers: ['912034014112649276'] });
    } else {
      let content = 'Please use either of the channels:\n';
      allowedChannels.forEach((chanel) => {
        content = `${content + channelMention(chanel)} `;
      });
      await interaction.reply({ content, ephemeral: true });
    }
  },
});
