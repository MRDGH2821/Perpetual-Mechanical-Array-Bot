/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-unused-vars
import { CommandInteraction } from "discord.js";
import { leaderboardGenerate } from "../lib/LeaderboardManager.js";

/**
 * shows leaderboard entry
 * @async
 * @function leaderboard_view
 * @param {CommandInteraction} interaction
 */
export async function leaderboard_view(interaction) {
  await interaction.deferReply();
  const dmgCategory = interaction.options.getString("category"),
    leaderboardEmbed = await leaderboardGenerate(
      interaction.client,
      dmgCategory
    );

  await interaction.editReply({
    embeds: [leaderboardEmbed]
  });
}
