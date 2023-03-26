import type { ChatInputOrContextMenuCommandInteraction } from '@sapphire/discord.js-utilities';
import { pickRandom, range } from '@sapphire/utilities';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  GuildMember,
  Message,
  MessageFlags,
  roleMention,
} from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { COLORS, EMPTY_STRING, ROLE_IDS } from '../../lib/Constants';
import { arrayIntersection, isStaff, PMAEventHandler } from './Utilities';

type AssignRoleOptions = {
  member: GuildMember;
  selectedRolesIDs: string[];
  message: Message;
  interaction: ChatInputOrContextMenuCommandInteraction;
};

type RegionEmoji = '🤔' | '🕊️' | '⚖️' | '⛩️' | '🌴';

type CrownEmoji =
  | '🤔'
  | '<:Anemo:803516622772895764>'
  | '<:Geo:803516612430135326>'
  | '<:Electro:803516644923146260>'
  | '<:Dendro:803516669984505856>'
  | '<:Hydro:803516313782714378>'
  | '<:Pyro:803516441424822303>'
  | '<:Cryo:803516632735154177>'
  | '✨';

type AbyssEmoji = '🤔' | '😎' | '🌀' | '⚔️';

type WhaleEmoji = '🐋' | '🐳' | '💰';

type RoleAssignStats = {
  exp: number;
  notes: string;
  role: string;
  emoji: '❌' | RegionEmoji | CrownEmoji | AbyssEmoji | WhaleEmoji;
};

export default class AssignRoles {
  #member: GuildMember;

  #embedDescription: string;

  #proofMessage: Message;

  readonly #selectedRoleIDs: string[];

  #ctx: ChatInputOrContextMenuCommandInteraction;

  #assignStats: RoleAssignStats[] = [];

  constructor(options: AssignRoleOptions) {
    let filteredRoles = options.selectedRolesIDs;

    if (options.selectedRolesIDs.includes(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)) {
      const denyList = [
        ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR.toString(),
        ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER.toString(),
      ];
      filteredRoles = options.selectedRolesIDs.filter((id) => !denyList.includes(id));
    } else if (options.selectedRolesIDs.includes(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR)) {
      filteredRoles = options.selectedRolesIDs.filter(
        (id) => id !== ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
      );
    }

    this.#selectedRoleIDs = filteredRoles;
    this.#proofMessage = options.message;
    this.#member = options.member;
    this.#ctx = options.interaction;
    this.#embedDescription = `The following roles have been assigned to ${this.#member}:\n`;
  }

  #awardReputationRoles() {
    const systemRoles = Object.values(ROLE_IDS.REPUTATION).map((role) => role.toString());
    const repRoles = this.#selectedRoleIDs.filter((id) => systemRoles.includes(id));

    this.#member.roles.add(repRoles, 'Completed regional exploration & achievements').then(() => {
      repRoles.forEach((role) => {
        let emoji: RegionEmoji = '🤔';
        if (role === ROLE_IDS.REPUTATION.MONDSTADT) {
          emoji = '🕊️';
        }
        if (role === ROLE_IDS.REPUTATION.LIYUE) {
          emoji = '⚖️';
        }
        if (role === ROLE_IDS.REPUTATION.INAZUMA) {
          emoji = '⛩️';
        }
        if (role === ROLE_IDS.REPUTATION.SUMERU) {
          emoji = '🌴';
        }
        this.#assignStats.push({
          exp: 250,
          notes: 'none',
          role,
          emoji,
        });
      });
    });
  }

  #awardWhaleRole() {
    const { WHALE } = ROLE_IDS.OTHERS;
    const WhaleEmojis: WhaleEmoji[] = ['🐋', '🐳', '💰'];
    this.#member.roles.add(WHALE, 'Spent some excess dollars in game....').then(() => {
      this.#assignStats.push({
        exp: 250,
        notes: 'none',
        role: WHALE,
        emoji: pickRandom(WhaleEmojis),
      });
    });
  }

  #awardUnalignedCrownRole() {
    const { UNALIGNED } = ROLE_IDS.CROWN;
    this.#member.roles.add(UNALIGNED, 'Crowned The Traveler').then(() => {
      this.#assignStats.push({
        exp: 30000,
        notes: 'Paid attention in the game!',
        role: UNALIGNED,
        emoji: '✨',
      });
    });
  }

  async #awardElementalCrownRole(roleID: ROLE_IDS.CROWN | string): Promise<RoleAssignStats> {
    const props: {
      color: COLORS;
      emoji: CrownEmoji;
    } = {
      color: COLORS.EMBED_COLOR,
      emoji: '🤔',
    };

    if (roleID === ROLE_IDS.CROWN.ANEMO) {
      props.color = COLORS.ANEMO;
      props.emoji = '<:Anemo:803516622772895764>';
    }

    if (roleID === ROLE_IDS.CROWN.GEO) {
      props.color = COLORS.GEO;
      props.emoji = '<:Geo:803516612430135326>';
    }
    if (roleID === ROLE_IDS.CROWN.ELECTRO) {
      props.color = COLORS.ELECTRO;
      props.emoji = '<:Electro:803516644923146260>';
    }
    if (roleID === ROLE_IDS.CROWN.DENDRO) {
      props.color = COLORS.DENDRO;
      props.emoji = '<:Dendro:803516669984505856>';
    }
    return new Promise((res, rej) => {
      const crownAmtRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder({
          emoji: '1️⃣',
          style: ButtonStyle.Secondary,
        }).setCustomId(`crown_${this.#member.id}_1`),
        new ButtonBuilder({
          emoji: '2️⃣',
          style: ButtonStyle.Secondary,
        }).setCustomId(`crown_${this.#member.id}_2`),
        new ButtonBuilder({
          emoji: '3️⃣',
          style: ButtonStyle.Secondary,
        }).setCustomId(`crown_${this.#member.id}_3`),
      ]);

      this.#ctx
        .editReply({
          embeds: [
            {
              title: '**How many Crowns?**',
              color: props.color,
              description: `How many crowns did ${this.#member} use on traveler for ${roleMention(
                roleID,
              )}`,
            },
          ],
          components: [crownAmtRow],
          options: {
            fetchReply: true,
          },
        })
        .then((msg) => {
          msg
            .awaitMessageComponent({
              filter(i) {
                if (i.member) {
                  return isStaff(i.member);
                }
                return false;
              },
              componentType: ComponentType.Button,
            })
            .then((btnCtx) => {
              const quantity = parseInt(btnCtx.customId.at(-1) || '1', 10);
              let exp = 250;
              range(1, quantity, 1).forEach((number) => {
                exp *= number;
              });
              PMAEventHandler.emit('CrownButtonListener', {
                quantity,
                target: this.#member,
                crownID: roleID,
              });
              this.#member.roles.add(roleID).then(() => {
                res({
                  exp,
                  notes: `${quantity} crown(s)`,
                  role: roleID,
                  emoji: props.emoji,
                });
              });
            })
            .catch(rej);
        })
        .catch(rej);
    });
  }

  async #awardElementalCrownRoles() {
    const systemRoles = Object.values(ROLE_IDS.CROWN).map((role) => role.toString());
    const crownRoles = this.#selectedRoleIDs.filter((id) => {
      if (id === ROLE_IDS.CROWN.UNALIGNED) {
        return false;
      }
      return systemRoles.includes(id);
    });

    const results: RoleAssignStats[] = await sequentialPromises(
      crownRoles,
      this.#awardElementalCrownRole,
    );

    this.#assignStats.push(...results);
  }

  async #awardSpiralAbyssRole() {
    const { SpiralAbyss } = ROLE_IDS;

    const beforeRemoval = {
      sovereign: this.#member.roles.cache.has(SpiralAbyss.ABYSSAL_SOVEREIGN),
      conqueror: this.#member.roles.cache.has(SpiralAbyss.ABYSSAL_CONQUEROR),
      traveler: this.#member.roles.cache.has(SpiralAbyss.ABYSSAL_TRAVELER),
    };

    await this.#member.roles.remove(Object.values(SpiralAbyss), 'Removing old roles');

    async function restoreRoles(newRoleID: string, target: GuildMember) {
      if (beforeRemoval.sovereign || newRoleID === ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN) {
        return target.roles.add(
          ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN,
          'Cleared Spiral Abyss at Sovereign Difficulty',
        );
      }
      if (beforeRemoval.conqueror || newRoleID === ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR) {
        return target.roles.add(
          ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
          'Cleared Spiral Abyss at Conqueror Difficulty',
        );
      }
      if (beforeRemoval.traveler || newRoleID === ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER) {
        return target.roles.add(
          ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
          'Cleared Spiral Abyss at Traveler Difficulty',
        );
      }
      return new Promise((res) => {
        res('No roles assigned');
      });
    }

    const abyssClearRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder({
        label: 'Traveler',
        emoji: '😎',
        style: ButtonStyle.Secondary,
      }).setCustomId('traveler'),
      new ButtonBuilder({
        label: 'Conqueror',
        emoji: '🌀',
        style: ButtonStyle.Secondary,
      }).setCustomId('conqueror'),
      new ButtonBuilder({
        label: 'Sovereign',
        emoji: '⚔️',
        style: ButtonStyle.Secondary,
      }).setCustomId('sovereign'),
      new ButtonBuilder({
        label: 'Criteria not Satisfied!',
        emoji: '❌',
        style: ButtonStyle.Danger,
      }).setCustomId('not_satisfied'),
    ]);

    await this.#ctx
      .editReply({
        embeds: [
          {
            title: '**Cleared Spiral Abyss?**',
            color: COLORS.EMBED_COLOR,
            description: `How did ${this.#member} satisfy the Condition?`,
            fields: [
              {
                name: 'Abyssal Traveler 😎',
                value: 'Cleared with Traveler',
              },
              {
                name: 'Abyssal Conqueror 🌀',
                value: 'Cleared with 3 different traveler elements',
              },
              {
                name: 'Abyssal Sovereign ⚔️',
                value:
                  'Cleared with 4 different Traveler elements with 4 different teams with no overlap between teammates',
              },
            ],
          },
        ],
        components: [abyssClearRow],
        options: {
          fetchReply: true,
        },
      })
      .then((msg) => {
        msg
          .awaitMessageComponent({
            filter(i) {
              if (i.member) {
                return isStaff(i.member);
              }
              return false;
            },
            componentType: ComponentType.Button,
          })
          .then(async (btnCtx) => {
            const clearType = btnCtx.customId;

            const conditionals: RoleAssignStats = {
              exp: 500,
              notes: 'Cleared 36/36 with Traveler',
              role: ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
              emoji: '😎',
            };

            const result: RoleAssignStats = {
              exp: 0,
              notes: 'none',
              role: '',
              emoji: '🤔',
            };
            if (clearType === 'not_satisfied') {
              await restoreRoles('none', this.#member);
              return;
            }
            if (clearType === 'sovereign') {
              conditionals.exp = 5000;
              conditionals.notes =
                'Cleared with 4 different Traveler elements with 4 different teams with no overlap between teammates';
              conditionals.role = ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN;
              conditionals.emoji = '⚔️';
            }

            if (clearType === 'conqueror') {
              conditionals.exp = 1500;
              conditionals.notes = 'Cleared with 3 different traveler elements';
              conditionals.role = ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER;
              conditionals.emoji = '🌀';
            }

            result.exp = conditionals.exp;
            result.notes = conditionals.notes;
            result.role = conditionals.role;
            this.#member.roles.add(result.role).then(async (member) => {
              this.#assignStats.push(result);
              await restoreRoles(conditionals.role, member);
            });
          });
      });
  }

  #hasSelectedRolesFrom(arr: any[]): boolean {
    return arrayIntersection(this.#selectedRoleIDs, arr).length > 0;
  }

  #hasSelectedRole(roleID: string) {
    return this.#selectedRoleIDs.includes(roleID);
  }

  async awardRoles() {
    if (this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.REPUTATION))) {
      this.#awardReputationRoles();
    }

    if (this.#hasSelectedRole(ROLE_IDS.OTHERS.WHALE)) {
      this.#awardWhaleRole();
    }

    if (this.#hasSelectedRole(ROLE_IDS.CROWN.UNALIGNED)) {
      this.#awardUnalignedCrownRole();
    }

    if (this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.CROWN))) {
      await this.#awardElementalCrownRoles();
    }

    if (this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.SpiralAbyss))) {
      await this.#awardSpiralAbyssRole();
    }

    let totalExp = 0;

    this.#assignStats.forEach((stat) => {
      totalExp += stat.exp;
      const line = `${roleMention(stat.role)}${stat.notes === 'none' ? ' ' : `:${stat.notes} `}(${
        stat.exp
      })\n`;
      this.#embedDescription += line;
      this.#proofMessage.react(stat.emoji);
    });

    this.#embedDescription += `\n**Total exp:** ${totalExp}`;

    await this.#ctx
      .editReply({
        content: EMPTY_STRING,
        embeds: [
          {
            color: COLORS.EMBED_COLOR,
            title: '**Roles successfully rewarded!**',
            description: this.#embedDescription,
          },
        ],
        components: [],
        options: {
          fetchReply: true,
        },
      })
      .then(async () => {
        await this.#ctx.reply({
          flags: MessageFlags.Ephemeral,
          content: `>award ${this.#member.id} ${totalExp}`,
        });
        await this.#ctx.reply({
          flags: MessageFlags.Ephemeral,
          content:
            'Copy paste that command. And a message by <@485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)',
        });

        this.#proofMessage.react('✅');
      });
  }
}
