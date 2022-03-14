/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
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
      const introEmb = new MessageEmbed()
          .setColor(EmbedColor)
          .setTitle('**Select Roles**')
          .setDescription(`Select Roles to give to ${target}. The amount of EXP will be calculated in end.`),
        rolesMenu = new MessageSelectMenu()
          .setCustomId('roles')
          .setPlaceholder('Select roles')
          .setMinValues(1)
          .addOptions([
            {
              description:
                'Completed Spiral Abyss 36/36 & all Spiral abyss achievements',
              emoji: '🌀',
              label: (await interaction.guild.roles.fetch(AbyssalConquerorID))
                .name,
              value: AbyssalConquerorID
            },
            {
              default: target.roles.cache.has(MondstadtReputationID),
              description:
                '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '🕊️',
              label: (
                await interaction.guild.roles.fetch(MondstadtReputationID)
              ).name,
              value: MondstadtReputationID
            },
            {
              default: target.roles.cache.has(LiyueReputationID),
              description:
                '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '⚖️',
              label: (await interaction.guild.roles.fetch(LiyueReputationID))
                .name,
              value: LiyueReputationID
            },
            {
              default: target.roles.cache.has(InazumaReputationID),
              description:
                '100% Map + Subregions + Achievements + Max Reputation',
              emoji: '⛩️',
              label: (await interaction.guild.roles.fetch(InazumaReputationID))
                .name,
              value: InazumaReputationID
            },
            {
              description: 'Crowned their Anemo Traveler',
              emoji: '🌪️',
              label: (await interaction.guild.roles.fetch(AnemoCrownID)).name,
              value: AnemoCrownID
            },
            {
              description: 'Crowned their Geo Traveler',
              emoji: '🪨',
              label: (await interaction.guild.roles.fetch(GeoCrownID)).name,
              value: GeoCrownID
            },
            {
              description: 'Crowned their Electro Traveler',
              emoji: '⚡',
              label: (await interaction.guild.roles.fetch(ElectroCrownID)).name,
              value: ElectroCrownID
            },
            {
              default: target.roles.cache.has(NonEleCrownID),
              description: 'Crowned their Unaligned Traveler',
              emoji: '👑',
              label: (await interaction.guild.roles.fetch(NonEleCrownID)).name,
              value: NonEleCrownID
            },
            {
              default: target.roles.cache.has(WhaleID),
              description: 'Spent $1000, or have c6 5* chars or r5 5* weapons',
              emoji: '💰',
              label: (await interaction.guild.roles.fetch(WhaleID)).name,
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
      await roleMsg
        .awaitMessageComponent({
          componentType: 'SELECT_MENU',
          filter: filterCollector,
          time: 60000
        })
        .then(async(interacted) => {
          // console.log('Interacted:', interacted);
          let expText = '',
            newRolesList = [],
            newRolesText = '',
            oldRolesText = '',
            totalExp = 0;
          console.log('Role IDs: ', interacted.values);
          for (const roleID of interacted.values) {
            if (crownRoles.includes(roleID)) {
              newRolesText = `${roleMention(roleID)} ${newRolesText}`;
              newRolesList.push(roleID);
            }
            // eslint-disable-next-line no-negated-condition
            else if (!target.roles.cache.has(roleID)) {
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
              name: '**Existing roles**',
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

            await spiralAbyssStat
              .awaitMessageComponent({
                componentType: 'BUTTON',
                filter: filterCollector,
                time: 60000
              })
              .then((button) => {
                if (button.customId === 'abyssWithTraveler') {
                  totalExp += exp;
                  interaction.client.emit('spiralAbyssClear', target, true);
                  expText = `${expText} \n✦ ${roleMention(AbyssalConquerorID)}: Cleared with traveler (+${exp + exp})`;
                }
                else {
                  interaction.client.emit('spiralAbyssClear', target, false);
                  expText = `${expText} \n✦ ${roleMention(AbyssalConquerorID)} (+${exp})`;
                }
              })
              .catch((error) => {
                console.error(error);
                expText = `${expText} \n✦ ${roleMention(AbyssalConquerorID)} (+${exp})`;
                interaction.client.emit('spiralAbyssClear', target, false);
              });
          }

          for (const crownRole of crownRoles) {
            if (newRolesList.includes(crownRole)) {
              newRolesList = newRolesList.filter((role) => role !== crownRole);
              let crownAmt = 1;
              const crownAmtRow = new MessageActionRow().addComponents([
                  new MessageButton()
                    .setCustomId('1')
                    .setEmoji('1️⃣')
                    .setStyle('SECONDARY'),
                  new MessageButton()
                    .setCustomId('2')
                    .setEmoji('2️⃣')
                    .setStyle('SECONDARY'),
                  new MessageButton()
                    .setCustomId('3')
                    .setEmoji('3️⃣')
                    .setStyle('SECONDARY')
                ]),
                crownRoleEmbed = new MessageEmbed()
                  .setColor(EmbedColor)
                  .setTitle('**How many crowns?**')
                  .setDescription(`How many crowns did ${target} use on traveler for ${roleMention(crownRole)}?`),
                // eslint-disable-next-line no-await-in-loop
                crownStat = await interaction.editReply({
                  components: [crownAmtRow],
                  embeds: [crownRoleEmbed]
                });

              // eslint-disable-next-line no-await-in-loop
              await crownStat
                .awaitMessageComponent({
                  componentType: 'BUTTON',
                  filter: filterCollector,
                  time: 60000
                })
                // eslint-disable-next-line no-loop-func
                .then((button) => {
                  let expGain = exp;
                  if (button.customId === '1') {
                    crownAmt = 1;
                    totalExp += exp;
                  }
                  else if (button.customId === '2') {
                    crownAmt = 2;
                    totalExp += exp * crownAmt;
                    expGain = exp * crownAmt;
                  }
                  else if (button.customId === '3') {
                    crownAmt = 3;
                    totalExp += exp * crownAmt * 2;
                    expGain = exp * crownAmt * 2;
                  }

                  expText = `${expText} \n✦ ${roleMention(crownRole)}: ${crownAmt} (+${expGain})`;

                  interaction.client.emit('travelerCrown', target, {
                    crownRoleID: crownRole,
                    crowns: crownAmt
                  });
                })
                // eslint-disable-next-line no-loop-func
                .catch((error) => {
                  totalExp += exp;
                  console.error(error);
                  expText = `${expText} \n✦ ${roleMention(crownRole)}: ${crownAmt} (+${exp})`;
                  interaction.client.emit('travelerCrown', target, {
                    crownRoleID: crownRole,
                    crowns: crownAmt
                  });
                });
            }
          }

          if (newRolesList.includes(NonEleCrownID)) {
            totalExp += 30000;
            expText = `${expText} \n✦ ${roleMention(NonEleCrownID)} (+30000)`;
            newRolesList = newRolesList.filter((role) => role !== NonEleCrownID);
            interaction.client.emit('travelerCrown', target, {
              crownRoleID: NonEleCrownID,
              crowns: 1
            });
          }

          if (newRolesList.includes(WhaleID)) {
            totalExp += exp;
            expText = `${expText} \n✦ ${roleMention(WhaleID)} (+${exp})`;
            newRolesList = newRolesList.filter((role) => role !== WhaleID);
          }

          for (const exploreRole of explorationRoles) {
            if (newRolesList.includes(exploreRole)) {
              totalExp += exp;
              expText = `${expText} \n✦ ${roleMention(exploreRole)} (+${exp})`;
              newRolesList = newRolesList.filter((role) => role !== exploreRole);
            }
          }

          introEmb.addFields([
            {
              name: '**Calculated Exp**',
              value: `${totalExp}`
            },
            {
              name: '**Exp Distribution**',
              value: expText
            }
          ]);

          const finalEmb = new MessageEmbed()
            .setTitle('**Roles successfully rewarded!**')
            .setColor(EmbedColor)
            .setDescription(`The following roles have been assigned to ${target}:\n${expText}\n\n**Total Exp**: ${totalExp}`);
          await interaction.editReply({
            components: [],
            embeds: [finalEmb]
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
            .setColor(EmbedColor)
            .setDescription(`There was an error while giving roles.\nError dump:\n\n${error}`);
          await interaction.user
            .send({
              components: [],
              content: 'Error!',
              embeds: [errorEmb]
            })
            .catch(console.error);
          await interaction.deleteReply();
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
