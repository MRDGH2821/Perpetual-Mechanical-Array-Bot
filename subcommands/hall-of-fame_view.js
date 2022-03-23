// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import { hallOfFameGenerate } from "../lib/HallOfFameManager.js";

/**
 * shows hall of fame
 * @async
 * @function hof_view
 * @param {CommandInteraction} interaction
 */
export async function hof_view(interaction) {
  await interaction.deferReply();

  const category = interaction.options.getString("category"),
    hofEmbed = await hallOfFameGenerate(interaction.client, category);

  await interaction.editReply({
    embeds: [hofEmbed]
  });
}
