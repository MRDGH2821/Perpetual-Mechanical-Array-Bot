import { roleMention, SlashCommandBuilder } from '@discordjs/builders';
// eslint-disable-next-line no-unused-vars
import { Command, CommandInteraction, MessageEmbed } from '@ruinguard/core';
import { CHANNEL_IDS, EMBED_COLOR, ROLE_IDS } from '../../lib/Constants.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('confession')
    .setDescription('Wanna confess something?')
    .addStringOption((option) => option
      .setName('confess')
      .setDescription('Enter your confession!')
      .setRequired(true))
    .addBooleanOption((option) => option.setName('anonymous').setDescription('Want to be Anonymous?'))
    .addBooleanOption((option) => option.setName('ping_archons').setDescription('Notify Archons?')),

  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const isAnon = interaction.options.getBoolean('anonymous');
    const shouldPingArchons = interaction.options.getBoolean('ping_archons');
    const confessionText = interaction.options.getString('confess');
    const confessChannel = await interaction.guild.channels.fetch(
      CHANNEL_IDS.confessions,
    );
    const logsChannel = await interaction.guild.channels.fetch(
      CHANNEL_IDS.archives,
    );

    const anonEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR)
      .setDescription(`${confessionText}`)
      .setTimestamp()
      .setTitle('**A New Confession!**')
      .setAuthor({ name: 'Anonymous' });

    const confessEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR)
      .setDescription(`${confessionText}`)
      .setTimestamp()
      .setTitle('**A New Confession!**')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        name: interaction.user.tag,
      });

    const text = shouldPingArchons ? roleMention(ROLE_IDS.archons) : ' ';

    if (isAnon) {
      confessChannel.send({
        content: text,
        embeds: [anonEmbed],
      });
      await interaction.reply({
        content: `Confession sent as Anonymous!\nCheck out ${confessChannel}`,
        ephemeral: true,
      });
    } else {
      confessChannel.send({
        content: text,
        embeds: [confessEmbed],
      });
      await interaction.reply({
        content: `Confession sent!\nCheck out ${confessChannel}`,
        ephemeral: true,
      });
    }

    logsChannel.send({ embeds: [confessEmbed] });
  },
});
