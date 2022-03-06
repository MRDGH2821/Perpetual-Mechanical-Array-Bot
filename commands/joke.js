import {
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import { Command } from '@ruinguard/core';
import { EmbedColor } from '../lib/constants.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getJoke } from '../lib/utilityFunctions.js';

const cmd = new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke!')
    .addStringOption((option) => option
      .setName('type')
      .setDescription('Select category of joke')
      .addChoice('Programming', 'Programming')
      .addChoice('Misc', 'Misc')
      .addChoice('Pun', 'Pun')
      .addChoice('Spooky', 'Spooky')
      .addChoice('Christmas', 'Christmas')
      .addChoice('Any', 'Any')),
  submitJoke = new MessageActionRow().addComponents(new MessageButton()
    .setLabel('Submit a joke!')
    .setStyle('LINK')
    .setURL('https://jokeapi.dev/#submit'));

export default new Command({
  data: cmd,

  /**
   * tell a joke
   * @async
   * @function run
   * @param {CommandInteraction} interaction - interaction object
   */
  async run(interaction) {
    const jokeEmbed = new MessageEmbed(),
      jokeType = interaction.options.getString('type') || 'Any',
      // eslint-disable-next-line sort-vars
      jokeJSON = await getJoke(jokeType);
    console.log('Joke: ', jokeJSON);

    let joke = '';
    if (jokeJSON.type === 'single') {
      joke = `${jokeJSON.joke}`;
    }
    else {
      joke = `${jokeJSON.setup}\n\n${jokeJSON.delivery}`;
    }

    jokeEmbed
      .setColor(EmbedColor)
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        name: `Requested by ${interaction.user.tag}`
      })
      .setTitle(`**${jokeJSON.category} Joke! (ID: ${jokeJSON.id})**`)
      .setDescription(`${joke}`);

    await interaction.reply({
      content: `Selected type: ${jokeType}`
    });
    await interaction.channel.send({
      components: [submitJoke],
      embeds: [jokeEmbed]
    });
  }
});
