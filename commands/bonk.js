const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonk')
		.setDescription('Select a member and bonk them.')
		.addUserOption(option => option.setName('target').setDescription('The member to bonk')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		return interaction.reply({ content: `${user.username} has been bonked!` });
	},
};
