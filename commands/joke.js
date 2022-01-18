import { Command } from '@ruinguard/core';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import axios from 'axios';

const baseAPI = 'https://v2.jokeapi.dev/joke/';
const blacklist
  = '?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';

const cmd = new SlashCommandBuilder()
  .setName('joke')
  .setDescription('Get a random joke!')
  .addBooleanOption(option => option.setName('programmming').setDescription('Get programmming joke'))
  .addBooleanOption(option => option.setName('misc').setDescription('Get Misc joke'))
  .addBooleanOption(option => option.setName('pun').setDescription('Get pun joke'))
  .addBooleanOption(option => option.setName('spooky').setDescription('Get spooky joke'))
  .addBooleanOption(option => option.setName('christmas').setDescription('Get christmas joke'));

const submitJoke = new MessageActionRow().addComponents(new MessageButton()
  .setLabel('Submit a joke!')
  .setStyle('LINK')
  .setURL('https://jokeapi.dev/#submit'));

export default new Command({
  data: cmd,
  async run(interaction) {
    const programming = await interaction.options.getBoolean('programming');
    const misc = await interaction.options.getBoolean('misc');
    const pun = await interaction.options.getBoolean('pun');
    const spooky = await interaction.options.getBoolean('spooky');
    const christmas = await interaction.options.getBoolean('christmas');

    let finalQuery = '';

    if (programming && misc && pun && spooky && christmas) {
      finalQuery = 'Any';
    } else if (!programming || !misc || !pun || !spooky || !christmas) {
      finalQuery = 'Any';
    } else {
      const query = [];
      if (programming) {
        query.concat(['Programming']);
      }
      if (misc) {
        query.concat(['Misc']);
      }
      if (pun) {
        query.concat(['Pun']);
      }
      if (spooky) {
        query.concat(['Spooky']);
      }
      if (christmas) {
        query.concat(['Christmas']);
      }
      const temp = JSON.stringify(query);
      console.log('temp: ', temp);

      finalQuery = temp.substring(1, temp.length - 1);
    }
    console.log('Final Query: ', finalQuery);

    const apiURL = `${baseAPI + finalQuery + blacklist}&format=txt&safe-mode`;
    console.log('API URL: ', apiURL);

    const joke = await axios.get(apiURL);
    console.log('Joke: ', joke.data);

    const jokeEmbed = new MessageEmbed()
      .setColor('#524437')
      .setTitle('**Joke!**')
      .setDescription(`${joke.data}`);

    await interaction.reply({
      embeds: [jokeEmbed],
      components: [submitJoke],
    });
  },
});
