import {
  AbyssalConquerorID,
  AnemoCrownID,
  ElectroCrownID,
  GeoCrownID,
  InazumaReputationID,
  LiyueReputationID,
  MondstadtReputationID,
  NonEleCrownID,
  WhaleID
} from '../lib/roleIDs.js';
import {
  // eslint-disable-next-line no-unused-vars
  ButtonInteraction,
  // eslint-disable-next-line no-unused-vars
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu
} from 'discord.js';
import { SlashCommandBuilder, roleMention } from '@discordjs/builders';
import CheckRolePerms from '../lib/staff-roles.js';
import { Command } from '@ruinguard/core';
import { EmbedColor } from '../lib/constants.js';
import { PepeKekPoint } from '../lib/emoteIDs.js';

export default new Command({
  data: new SlashCommandBuilder()
    .setName('give-role')
    .setDescription('Gives role to a selected user!')
    .addUserOption((option) => option.setName('user').setDescription('Select user')
      .setRequired(true)),

  /**
   * gives role to selected user
   * @async
   * @function run
   * @param {CommandInteraction} interaction
   */
  async run(interaction) {
    await interaction.deferReply();
    const permCheck = new CheckRolePerms(interaction.member),
      target = interaction.options.getMember('user');
    if (permCheck.isStaff() || permCheck.canGibRole()) {
      const AbyssalConquerorRole = await interaction.guild.roles.fetch(AbyssalConquerorID),
        AnemoCrownRole = await interaction.guild.roles.fetch(AnemoCrownID),
        ElectroCrownRole = await interaction.guild.roles.fetch(ElectroCrownID),
        GeoCrownRole = await interaction.guild.roles.fetch(GeoCrownID),
        InazumaReputationRole = await interaction.guild.roles.fetch(InazumaReputationID),
        LiyueReputationRole = await interaction.guild.roles.fetch(LiyueReputationID),
        MondstadtReputationRole = await interaction.guild.roles.fetch(MondstadtReputationID),
        NonEleCrownRole = await interaction.guild.roles.fetch(NonEleCrownID),
        WhaleRole = await interaction.guild.roles.fetch(WhaleID),
        introEmb = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle('**Select Roles**')
          .setDescription(`Select Roles to give to ${target}. The amount of EXP will be calculated in end.`),
        rolesRow = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder('Select roles')
        // eslint-disable-next-line no-magic-numbers
          .setMinValues(1)
          .addOptions([
            {
              description:
                  'Completed Spiral Abyss 36/36 & all Spiral abyss achievements',
              emoji: '🌀',
              label: AbyssalConquerorRole.name,
              value: AbyssalConquerorID
            },
            {
              description:
                  '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '🕊️',
              label: MondstadtReputationRole.name,
              value: MondstadtReputationID
            },
            {
              description:
                  '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '⚖️',
              label: LiyueReputationRole.name,
              value: LiyueReputationID
            },
            {
              description:
                  '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '⛩️',
              label: InazumaReputationRole.name,
              value: InazumaReputationID
            },
            {
              description: 'Crowned their Anemo Traveler',
              emoji: '🌪️',
              label: AnemoCrownRole.name,
              value: AnemoCrownID
            },
            {
              description: 'Crowned their Geo Traveler',
              emoji: '🪨',
              label: GeoCrownRole.name,
              value: GeoCrownID
            },
            {
              description: 'Crowned their Electro Traveler',
              emoji: '⚡',
              label: ElectroCrownRole.name,
              value: ElectroCrownID
            },
            {
              description: 'Crowned their Unaligned Traveler',
              emoji: '👑',
              label: NonEleCrownRole.name,
              value: NonEleCrownID
            },
            {
              description:
                  'Spent $1000, or have c6 5* chars or r5 5* weapons',
              emoji: '💰',
              label: WhaleRole.name,
              value: WhaleID
            }
          ])),
        // eslint-disable-next-line sort-vars
        roleMsg = await interaction.editReply({
          components: [rolesRow],
          embeds: [introEmb],
          fetchReply: true
        }),
        // eslint-disable-next-line sort-vars
        roleCollector = roleMsg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 60000
        });

      roleCollector.on('collect', async(interacted) => {
        console.log('Collecting role options');
        if (interacted.user.id === interaction.user.id) {
          let selectedRoles = '';
          for (const roleID of interacted.values) {
            selectedRoles = `${roleMention(roleID)}\n${selectedRoles}`;
          }
          introEmb.addFields([
            {
              name: '**Selected Roles**',
              value: selectedRoles
            }
          ]);
          await interaction.editReply({
            components: [],
            embeds: introEmb,
            fetchReply: true
          });
        }
        else {
          await interacted.reply('These buttons are not for you!');
        }

        roleCollector.stop();
      });
      roleCollector.on('end', (interacted) => {
        console.log('collected: ');
        console.log(interacted);
      });
      console.log('Can give roles');
    }
    else {
      await interaction.editReply({
        content: `You can't give roles, not even to yourself ${PepeKekPoint}`,
        ephemeral: true
      });
    }
  }
});
