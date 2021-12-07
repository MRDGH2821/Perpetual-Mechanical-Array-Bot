import { Command } from "@ruinguard/core";

export default new Command({
  data: {
    name: "padoru",
    description: "Will sing Padoru (as text)"
  },

  async run(interaction) {
    const channel = interaction.channel;
    await interaction.reply({
      content: "Sending",
      ephemeral: true
    });
    await channel.send("<@&813613841488936971> Hashire sori yo");
    await channel.send("<@&813613841488936971> Kazeno yuu ni");
    await channel.send("<@&813613841488936971> Tsukkimihara wo");
    await channel.send("<@&813613841488936971> PADORU PADORU");
    await channel.send(
      "<:LuminePadoru:912033737280192562><:LuminePadoru:912033737280192562><:LuminePadoru:912033737280192562><:LuminePadoru:912033737280192562>"
    );
  }
});
