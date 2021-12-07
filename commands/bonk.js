import { Command } from "@ruinguard/core";

export default new Command({
  data: {
    name: "bonk",
    description: "Select a member and bonk them.",
    options: [
      {
        type: 6,
        name: "target",
        description: "The member to bonk",
        required: true
      },
      {
        type: 3,
        name: "reason",
        description: "Reason to bonk"
      }
    ]
  },
flags: [1<<1],
  async run(interaction) {
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
});
