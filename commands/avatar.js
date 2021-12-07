import { Command } from "@ruinguard/core";

export default new Command({
  data: {
    name: "avatar",
    description: "Get the avatar URL of the selected user, or your own avatar.",
    options: [
      {
        type: 6,
        name: "target",
        description: "The user's avatar to show"
      }
    ]
  },
flags: [1<<1],
  async execute(interaction) {
    const user = interaction.options.getUser("target");
    if (user)
      return interaction.reply(
        `${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`
      );
    return interaction.reply(
      `Your avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`
    );
  }
});
