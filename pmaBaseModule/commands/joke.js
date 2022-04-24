import { SlashCommandBuilder } from '@discordjs/builders';
import {
  Command,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from '@ruinguard/core';
import { EMBED_COLOR } from '../../lib/Constants.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke!')
    .addStringOption((option) => option
      .setName('type')
      .setDescription('Select category of joke')
      .addChoices(
        {
          name: 'Programming',
          value: 'Programming',
        },
        { name: 'Misc', value: 'Misc' },
        { name: 'Pun', value: 'Pun' },
        { name: 'Spooky', value: 'Spooky' },
        { name: 'Christmas', value: 'Christmas' },
        {
          name: 'Any',
          value: 'Any',
        },
      )),

  /**
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    const submitJoke = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Submit a joke!')
        .setStyle('LINK')
        .setURL('https://jokeapi.dev/#submit'),
    );

    const jokeType = interaction.options.getString('type') || 'Any';

    const jokeJSON = await fetch(
      `https://v2.jokeapi.dev/joke/${jokeType}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&safe-mode`,
    ).then((res) => res.json());

    let joke = '';
    if (jokeJSON.type === 'single') {
      joke = `${jokeJSON.joke}`;
    } else {
      joke = `${jokeJSON.setup}\n\n${jokeJSON.delivery}`;
    }

    const jokeEmbed = new MessageEmbed()
      .setColor(EMBED_COLOR)
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        name: `Requested by ${interaction.user.tag}`,
      })
      .setTitle(`**${jokeJSON.category} Joke! (ID: ${jokeJSON.id})**`)
      .setDescription(`${joke}`);

    await interaction.reply({
      content: `Selected type: ${jokeType}`,
    });
    await interaction.channel.send({
      components: [submitJoke],
      embeds: [jokeEmbed],
    });
  },
});
