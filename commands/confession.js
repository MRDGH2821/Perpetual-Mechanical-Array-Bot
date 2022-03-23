// eslint-disable-next-line no-unused-vars
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder, roleMention } from "@discordjs/builders";
import { archivesID, confessionID } from "../lib/channelIDs.js";
import { ArchonsID } from "../lib/roleIDs.js";
import { Command } from "@ruinguard/core";
import { EmbedColor } from "../lib/constants.js";

const cmd = new SlashCommandBuilder()
  .setName("confession")
  .setDescription("Wanna confess something?")
  .addStringOption((option) => option
    .setName("confess")
    .setDescription("Enter your confession!")
    .setRequired(true))
  .addBooleanOption((option) => option.setName("anonymous").setDescription("Want to be Anonymous?"))
  .addBooleanOption((option) => option.setName("ping_archons").setDescription("Notify Archons?"));

export default new Command({
  data: cmd,

  /**
   * send confession to confession channel & log channel
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const anonymous = interaction.options.getBoolean("anonymous") || false,
      archonNotification =
        interaction.options.getBoolean("ping_archons") || false,
      channelConfess = await interaction.guild.channels.fetch(confessionID),
      channelLog = await interaction.guild.channels.fetch(archivesID),
      confessionText = interaction.options.getString("confess"),
      embedAnon = new MessageEmbed()
        .setColor(EmbedColor)
        .setDescription(`${confessionText}`)
        .setTimestamp()
        .setTitle("**A New Confession!**")
        .setAuthor({ name: "Anonymous" }),
      embedConfess = new MessageEmbed()
        .setColor(EmbedColor)
        .setDescription(`${confessionText}`)
        .setThumbnail(interaction.user.displayAvatarURL({
          dynamic: true
        }))
        .setTimestamp()
        .setTitle("**A New Confession!**")
        .setAuthor({
          iconURL: interaction.user.displayAvatarURL({
            dynamic: true
          }),
          name: interaction.user.tag
        });
    let text = " ";
    if (archonNotification) {
      text = roleMention(ArchonsID);
    }

    if (anonymous) {
      channelConfess.send({
        content: text,
        embeds: [embedAnon]
      });
      await interaction.reply({
        content: `Confession sent as Anonymous!\nCheck out ${channelConfess}`,
        ephemeral: true
      });
    }
    else {
      channelConfess.send({
        content: text,
        embeds: [embedConfess]
      });
      await interaction.reply({
        content: `Confession sent!\nCheck out ${channelConfess}`,
        ephemeral: true
      });
    }
    channelLog.send({ embeds: [embedConfess] });
  }
});
