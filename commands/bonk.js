const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bonk")
    .setDescription("Select a member and bonk them.")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The member to bonk")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason to bonk")
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason");
    if (!reason) {
      return interaction.reply({ content: `${user} has been bonked!` });
    } else {
      return interaction.reply({
        content: `${user} has been bonked!\nReason: ${reason}`
      });
    }
  }
};
