import {
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import CheckRolePerms from '../lib/staff-roles.js';
import { Colors } from '../lib/constants.js';
import { Command } from '@ruinguard/core';
import { HmmTher } from '../lib/emoteIDs.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { isURLvalid } from '../lib/utilityFunctions.js';

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
      .addChoice('Anemo: Palm Vortex', 'anemo-dmg-skill')
      .addChoice('Geo: Starfell Sword', 'geo-dmg-skill')
      .addChoice('Electro: Lightening Blade', 'electro-dmg-skill')
      .addChoice('Universal: 5th Normal Atk dmg', 'uni-dmg-n5'))
    .addStringOption((option) => option
      .setName('group_type')
      .setDescription('Type category')
      .setRequired(true)
      .addChoice('Solo', 'solo')
      .addChoice('Open', 'open'))
    .addIntegerOption((option) => option
      .setName('score')
      .setDescription('Score i.e. Damage value')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('proof_link')
      .setDescription('Upload proof on traveler showcase channel & copy link to message')
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
      modCheck = new CheckRolePerms(interaction.member),
      proofLink = interaction.options.getString('proof_link'),
      score = interaction.options.getInteger('score'),
      typeCategory = interaction.options.getString('group_type'),
      user = await interaction.options.getUser('contestant'),
      verifyEmb = new MessageEmbed()
        .setTitle('**Entry Verification**')
        .setDescription(`**Contestant**: ${user} \n**Category**: ${dmgCategory} \n**Type**: ${typeCategory} \n**Score (i.e. Dmg value)**: ${score} \n\n**Proof**: \n${proofLink}`),
      // eslint-disable-next-line sort-vars
      approveRow = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId('accepted')
          .setLabel('Accept')
          .setEmoji('👍')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('rejected')
          .setLabel('Reject')
          .setEmoji('👎')
          .setStyle('DANGER')
      ]);
    console.log(dmgCategory);
    if ((/anemo./gimu).test(dmgCategory)) {
      verifyEmb.setColor(Colors.AnemoColor);
    }
    else if ((/geo./gimu).test(dmgCategory)) {
      verifyEmb.setColor(Colors.GeoColor);
    }
    else if ((/electro./gimu).test(dmgCategory)) {
      verifyEmb.setColor(Colors.ElectroColor);
    }
    else if ((/uni./gimu).test(dmgCategory)) {
      verifyEmb.setColor(Colors.UnivColor);
    }
    else {
      verifyEmb.setColor(Colors.EmbedColor);
    }

    if (user.bot) {
      return interaction.editReply({
        content: `Bots cannot register for leaderboard ${HmmTher}\n\nUser ID: \`${user.id}\` \nUser: \`${user.tag}\``,
        ephemeral: true
      });
    }
    else if (!isURLvalid(proofLink)) {
      return interaction.editReply({
        content: `Please enter a valid link. Received:\n ${proofLink}`,
        ephemeral: true
      });
    }
    // eslint-disable-next-line one-var
    const staffApproval = await interaction.editReply({
      components: [approveRow],
      embeds: [verifyEmb],
      fetchReply: true
    });

    return staffApproval
      .awaitMessageComponent({
        componentType: 'BUTTON',
        // filter: staffFilter,
        time: 300000
      })
      .then(async(interacted) => {
        // console.log(interacted);
        if (modCheck.isStaff(interacted.member)) {
          console.log(interacted.customId);
          if (interacted.customId === 'accepted') {
            verifyEmb
              .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/check-mark-button_2705.png')
              .setTitle('**Submission Accepted!**')
              .setColor(Colors.Success);
            await interaction.editReply({
              components: [],
              embeds: [verifyEmb]
            });

            interaction.client.emit('leaderboardEntry', user, {
              elementCategory: dmgCategory,
              proof: proofLink,
              score,
              typeCategory
            });
          }
          else if (interacted.customId === 'rejected') {
            verifyEmb
              .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/cross-mark_274c.png')
              .setTitle('**Submission Rejected!**')
              .setColor(Colors.Error);
            await interaction.editReply({
              components: [],
              embeds: [verifyEmb]
            });
          }
          else {
            throw new Error('Unknown Button received');
          }
        }
        else {
          interacted.reply({
            content: 'Ping a mod to get approval!',
            ephemeral: true
          });
        }
      })
      .catch(async(error) => {
        verifyEmb
          .addFields([
            {
              name: '**Time out!**',
              value:
                'Please run the command again & ping a mod to review the submission!'
            },
            {
              name: '**Internal Errors if any**',
              value: `${error}\n\n(If the reason is time, then it is because submission approval message is set to expire after 30 seconds)`
            }
          ])
          .setColor(Colors.Error);

        await interaction.editReply({
          components: [],
          embeds: [verifyEmb]
        });
      });
  }
});
