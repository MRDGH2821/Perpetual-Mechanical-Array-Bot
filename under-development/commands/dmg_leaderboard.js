import {
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import { SlashCommandBuilder, hyperlink } from '@discordjs/builders';
import { Command } from '@ruinguard/core';
import { staff } from '../../lib/staff-roles.js';
export default new Command({
  data: new SlashCommandBuilder()
    .setName('dmg_leaderboard')
    .setDescription('Register score')
    .addUserOption((option) => option
      .setName('contestant')
      .setDescription('Who made the score? (You can put User ID as well)')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('category')
      .setDescription('Damage category')
      .setRequired(true)
      .addChoices([
        {
          name: 'Anemo: Palm Vortex',
          value: 'anemo-dmg-skill'
        },
        {
          name: 'Geo: Starfell Sword',
          value: 'geo-dmg-skill'
        },
        {
          name: 'Electro: Lightening Blade',
          value: 'electro-dmg-skill'
        },
        {
          name: 'Universal: 5th Normal Atk dmg',
          value: 'uni-dmg-n5'
        }
      ]))
    .addStringOption((option) => option
      .setName('type')
      .setDescription('Type category')
      .setRequired(true)
      .addChoices([
        {
          name: 'Solo',
          value: 'solo'
        },
        {
          name: 'Open',
          value: 'open'
        }
      ]))
    .addIntegerOption((option) => option
      .setName('score')
      .setDescription('Score i.e. Damage value')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('proof_link')
      .setDescription('Upload proof on traveler show case channel & copy link to message')
      .setRequired(true)),

  /**
   * submits score for leaderboard
   * @async
   * @function run
   * @param { CommandInteraction } interaction - interaction object
   */
  async run(interaction) {
    await interaction.deferReply();
    const dmgCategory = interaction.options.getString('category'),
      proofLink = interaction.options.getString('proof_link'),
      score = interaction.options.getInteger('score'),
      typeCategory = interaction.options.getString('type'),
      user = interaction.options.getUser('user') || interaction.user,
      verifyEmb = new MessageEmbed()
        .setTitle('**Entry Verification**')
        .setDescription(`**Contestant**: ${user} \n**Category**: ${dmgCategory} \n**Type**: ${typeCategory} \n**Score (i.e. Dmg value)**: ${score} \n\nClick here to see proof ${hyperlink(
          'proof',
          proofLink,
          `Proof submitted by ${user.tag}`
        )}`),
      // eslint-disable-next-line sort-vars
      staffFilter = (interacted) => {
        interacted.deferUpdate();
        return staff.includes(interacted.user.id);
      },
      // eslint-disable-next-line sort-vars
      approveRow = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId('accepted')
          .setLabel('Accept')
          .setEmoji('👍')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('accepted')
          .setLabel('Accept')
          .setEmoji('👎')
          .setStyle('DANGER')
      ]),
      // eslint-disable-next-line sort-vars
      staffApproval = await interaction.editReply({
        components: [approveRow],
        embeds: [verifyEmb]
      });

    await staffApproval
      .awaitMessageComponent({
        componentType: 'BUTTON',
        filter: staffFilter,
        time: 300000
      })
      .then((interacted) => {
        console.log(interacted.values);
      });
  }
});
