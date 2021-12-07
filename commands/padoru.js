const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("padoru")
    .setDescription("Will sing Padoru (as text)"),

  async execute(interaction) {
    await interaction.reply({
      content: `<@&813613841488936971> Hashire sori yo\nKazeno yuu ni\nTsukkimihara wo\nPADORU PADORU\n<:LuminePadoru:912033737280192562><:LuminePadoru:912033737280192562><:LuminePadoru:912033737280192562><:LuminePadoru:912033737280192562>`
    });
  }
};
