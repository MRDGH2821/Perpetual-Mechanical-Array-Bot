import { Event } from "@ruinguard/core";

export default new Event({
  event: "interactionCreate",
  run(interaction) {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    );
    interaction.client._onInteractionCreate(interaction);
  }
});
