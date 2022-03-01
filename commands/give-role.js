/* eslint-disable max-lines */
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
  MessageButton,
  MessageEmbed,
  MessageSelectMenu
} from 'discord.js';
import { SlashCommandBuilder, roleMention } from '@discordjs/builders';
import { crownRoles, explorationRoles } from '../lib/achievement-roles.js';
import CheckRolePerms from '../lib/staff-roles.js';
import { Command } from '@ruinguard/core';
import { EmbedColor } from '../lib/constants.js';
import { PepeKekPoint } from '../lib/emoteIDs.js';

const exp = 250;

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
        rolesMenu = new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder('Select roles')
          // eslint-disable-next-line no-magic-numbers
          .setMinValues(1)
          .addOptions([
            {
              default: target.roles.cache.has(AbyssalConquerorID),
              description:
                'Completed Spiral Abyss 36/36 & all Spiral abyss achievements',
              emoji: '🌀',
              label: AbyssalConquerorRole.name,
              value: AbyssalConquerorID
            },
            {
              default: target.roles.cache.has(MondstadtReputationID),
              description:
                '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '🕊️',
              label: MondstadtReputationRole.name,
              value: MondstadtReputationID
            },
            {
              default: target.roles.cache.has(LiyueReputationID),
              description:
                '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '⚖️',
              label: LiyueReputationRole.name,
              value: LiyueReputationID
            },
            {
              default: target.roles.cache.has(InazumaReputationID),
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
              default: target.roles.cache.has(WhaleID),
              description: 'Spent $1000, or have c6 5* chars or r5 5* weapons',
              emoji: '💰',
              label: WhaleRole.name,
              value: WhaleID
            }
          ]),
        rolesRow = new MessageActionRow().addComponents(rolesMenu),
        // eslint-disable-next-line sort-vars
        roleMsg = await interaction.editReply({
          components: [rolesRow],
          embeds: [introEmb],
          fetchReply: true
        }),
        // eslint-disable-next-line sort-vars
        filterCollector = (interacted) => {
          interacted.deferUpdate();
          return interacted.user.id === interaction.user.id;
        };
      // eslint-disable-next-line sort-vars
      roleMsg
        .awaitMessageComponent({
          componentType: 'SELECT_MENU',
          filter: filterCollector,
          time: 60000
        })
        .then(async(interacted) => {
          console.log('Interacted:', interacted);
          let newRolesList = [],
            newRolesText = '',
            oldRolesText = '',
            totalExp = 0;
          console.log('Role IDs: ', interacted.values);
          for (const roleID of interacted.values) {
            // eslint-disable-next-line no-negated-condition
            if (!target.roles.cache.has(roleID)) {
              newRolesText = `${roleMention(roleID)} ${newRolesText}`;
              newRolesList.push(roleID);
            }
            else {
              oldRolesText = `${roleMention(roleID)} ${oldRolesText}`;
            }
          }
          console.log('New Roles: ', newRolesList);
          introEmb.addFields([
            {
              name: '**Existing roles (except crowns)**',
              value: oldRolesText || 'None'
            },
            {
              name: '**New Roles to assign**',
              value: newRolesText || 'None selected'
            }
          ]);

          await interaction.editReply({
            components: [],
            embeds: [introEmb],
            fetchReply: true
          });

          if (newRolesList.includes(WhaleID)) {
            totalExp += exp;
            newRolesList = newRolesList.filter((role) => role !== WhaleID);
          }

          for (const exploreRole of explorationRoles) {
            if (newRolesList.includes(exploreRole)) {
              totalExp += exp;
              newRolesList = newRolesList.filter((role) => role !== exploreRole);
            }
          }

          if (newRolesList.includes(AbyssalConquerorID)) {
            totalExp += exp;
            newRolesList = newRolesList.filter((role) => role !== AbyssalConquerorID);
            const spiralAbyssEmbed = new MessageEmbed()
                .setColor(EmbedColor)
                .setTitle('**Cleared with traveler?**')
                .setDescription(`Did ${target} clear abyss with traveler?`),
              spiralAbyssRow = new MessageActionRow().addComponents([
                new MessageButton()
                  .setCustomId('abyssWithTraveler')
                  .setLabel('Cleared with traveler')
                  .setEmoji('👍')
                  .setStyle('PRIMARY'),
                new MessageButton()
                  .setCustomId('abyssNoTraveler')
                  .setLabel('Not cleared with traveler')
                  .setEmoji('👎')
                  .setStyle('SECONDARY')
              ]),
              spiralAbyssStat = await interaction.editReply({
                components: [spiralAbyssRow],
                embeds: [spiralAbyssEmbed]
              });

            spiralAbyssStat
              .awaitMessageComponent({
                componentType: 'BUTTON',
                filter: filterCollector,
                time: 20000
              })
              .then((button) => {
                if (button.customId === 'abyssWithTraveler') {
                  totalExp += exp;
                  interaction.client.emit('spiralAbyssClear', target, true);
                }
              })
              .catch((error) => {
                console.error(error);
                interaction.client.emit('spiralAbyssClear', target, true);
              });
          }

          for (const crownRole of crownRoles) {
            if (newRolesList.includes(crownRole)) {
              newRolesList = newRolesList.filter((role) => role !== crownRole);
              const crownAmtRow = new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId('1')
                    .setEmoji('1️⃣')
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('2')
                    .setEmoji('2️⃣')
                    .setStyle('PRIMARY'),
                  new MessageButton()
                    .setCustomId('3')
                    .setEmoji('3️⃣')
                    .setStyle('PRIMARY')
                ]),
                crownRoleEmbed = new MessageEmbed()
                  .setColor(EmbedColor)
                  .setTitle('**Cleared with traveler?**')
                  .setDescription(`Did ${target} clear abyss with traveler?`),
                // eslint-disable-next-line no-await-in-loop
                crownStat = await interaction.editReply({
                  components: [crownAmtRow],
                  embeds: [crownRoleEmbed]
                });

              crownStat
                .awaitMessageComponent({
                  componentType: 'BUTTON',
                  filter: filterCollector,
                  time: 20000
                })
                // eslint-disable-next-line no-loop-func
                .then((button) => {
                  let factor = 1;
                  if (button.customId === '1') {
                    totalExp += exp;
                  }
                  else if (button.customId === '2') {
                    // eslint-disable-next-line no-magic-numbers
                    factor = 2;
                    totalExp += exp * factor;
                  }
                  else if (button.customId === '3') {
                    // eslint-disable-next-line no-magic-numbers
                    factor = 3;
                    // eslint-disable-next-line no-magic-numbers
                    totalExp += exp * factor * 2;
                  }
                  interaction.client.emit(
                    'travelerCrown',
                    target,
                    factor,
                    crownRole
                  );
                })
                // eslint-disable-next-line no-loop-func
                .catch((error) => {
                  totalExp += exp;
                  console.error(error);
                  // eslint-disable-next-line no-magic-numbers
                  interaction.client.emit(
                    'travelerCrown',
                    target,
                    // eslint-disable-next-line no-magic-numbers
                    1,
                    crownRole
                  );
                });
            }
          }
          introEmb.addFields([
            {
              name: '**Calculated Exp**',
              value: `${totalExp}`
            }
          ]);
          await interaction.editReply({
            components: [],
            embeds: [introEmb]
          });
          await interaction.followUp({
            content: `>award ${target.user.id} ${totalExp}`,
            ephemeral: true
          });
          await interaction.followUp({
            content:
              'Copy paste that command. And a message by <@!485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)',
            ephemeral: true
          });
          await target.roles.add(interacted.values);
        })
        .catch(async(error) => {
          const errorEmb = new MessageEmbed()
            .setTitle('**ERROR!**')
            .setDescription(`Error dump:\n\n${error}`);
          await interaction.editReply({
            components: [],
            content: 'Error!',
            embeds: [errorEmb]
          });
        });
    }
    else {
      await interaction.editReply({
        content: `You can't give roles, not even to yourself ${PepeKekPoint}`,
        ephemeral: true
      });
    }
  }
});
