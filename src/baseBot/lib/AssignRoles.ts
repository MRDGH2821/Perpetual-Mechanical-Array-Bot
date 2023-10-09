import type { ChatInputOrContextMenuCommandInteraction } from '@sapphire/discord.js-utilities';
import { pickRandom, range } from '@sapphire/utilities';
import {
  ButtonStyle,
  ComponentType,
  GuildMember,
  Message,
  MessageFlags,
  roleMention,
  type APIEmbed,
} from 'discord.js';
import {
  COLORS, EMPTY_STRING, ROLE_IDS, ThreadIds,
} from '../../lib/Constants';
import type { ButtonActionRow, RegisterCrownArgs } from '../../typeDefs/typeDefs';
import { arrayIntersection, isStaff, PMAEventHandler } from './Utilities';

type AssignRoleOptions = {
  member: GuildMember;
  selectedRolesIDs: string[];
  message: Message | null | undefined;
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

  #proofMessage: AssignRoleOptions['message'];

  readonly #selectedRoleIDs: string[];

  #ctx: ChatInputOrContextMenuCommandInteraction;

  #assignStats: RoleAssignStats[] = [];

  constructor(options: AssignRoleOptions) {
    let filteredRoles = options.selectedRolesIDs;

    if (options.selectedRolesIDs.includes(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)) {
      const denyList = [
        ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
        ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
      ].map(String);
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

  async #awardReputationRoles() {
    const systemRoles = Object.values(ROLE_IDS.REPUTATION).map(String);
    const repRoles = this.#selectedRoleIDs.filter((id) => systemRoles.includes(id));

    await this.#member.roles
      .add(repRoles, 'Completed regional exploration & achievements')
      .then(() => {
        repRoles.forEach((role) => {
          let emoji: RegionEmoji = '🤔';

          switch (role) {
            case ROLE_IDS.REPUTATION.MONDSTADT: {
              emoji = '🕊️';
              break;
            }
            case ROLE_IDS.REPUTATION.LIYUE: {
              emoji = '⚖️';
              break;
            }
            case ROLE_IDS.REPUTATION.INAZUMA: {
              emoji = '⛩️';
              break;
            }
            case ROLE_IDS.REPUTATION.SUMERU: {
              emoji = '🌴';
              break;
            }

            default: {
              emoji = '🤔';
              break;
            }
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

  async #awardWhaleRole() {
    const { WHALE } = ROLE_IDS.OTHERS;
    const WhaleEmojis: WhaleEmoji[] = ['🐋', '🐳', '💰'];
    await this.#member.roles.add(WHALE, 'Spent some excess dollars in game....').then(() => {
      this.#assignStats.push({
        exp: 250,
        notes: 'none',
        role: WHALE,
        emoji: pickRandom(WhaleEmojis),
      });
    });
  }

  async #awardUnalignedCrownRole() {
    const { UNALIGNED } = ROLE_IDS.CROWN;
    await this.#member.roles.add(UNALIGNED, 'Crowned The Traveler').then(() => {
      AssignRoles.registerCrown({
        crownID: UNALIGNED,
        quantity: 1,
        target: this.#member,
      });
      this.#assignStats.push({
        exp: 30000,
        notes: 'Paid attention in the game!',
        role: UNALIGNED,
        emoji: '✨',
      });
    });
  }

  static registerCrown(args: RegisterCrownArgs) {
    PMAEventHandler.emit('RegisterCrown', args);
  }

  async #reactEmoji(emoji: string) {
    return this.#proofMessage?.react(emoji);
  }

  async #awardElementalCrownRole(roleID: ROLE_IDS.CROWN): Promise<RoleAssignStats> {
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
    if (roleID === ROLE_IDS.CROWN.HYDRO) {
      props.color = COLORS.HYDRO;
      props.emoji = '<:Hydro:803516313782714378>';
    }
    return new Promise((res, rej) => {
      const crownAmtRow: ButtonActionRow = {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            emoji: '1️⃣',
            style: ButtonStyle.Secondary,
            customId: `crown_${this.#member.id}_1`,
          },
          {
            type: ComponentType.Button,
            emoji: '2️⃣',
            style: ButtonStyle.Secondary,
            customId: `crown_${this.#member.id}_2`,
          },
          {
            type: ComponentType.Button,
            emoji: '3️⃣',
            style: ButtonStyle.Secondary,
            customId: `crown_${this.#member.id}_3`,
          },
        ],
      };
      // container.logger.debug(JSON.stringify({ roleID }, null, 2));
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
        .then(async (msg) => {
          await msg
            .awaitMessageComponent({
              async filter(i) {
                await i.deferUpdate();
                if (i.member) {
                  return isStaff(i.member);
                }
                return false;
              },
              componentType: ComponentType.Button,
              dispose: true,
            })
            .then((btnCtx) => {
              const quantity = parseInt(btnCtx.customId.at(-1) || '1', 10);
              let exp = 250;
              range(1, quantity, 1).forEach((number) => {
                exp *= number;
              });
              AssignRoles.registerCrown({
                crownID: roleID,
                quantity,
                target: this.#member,
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
    const systemRoles = Object.values(ROLE_IDS.CROWN).map(String);
    const crownRoles = this.#selectedRoleIDs.filter((id) => {
      if (id === ROLE_IDS.CROWN.UNALIGNED) {
        return false;
      }
      return systemRoles.includes(id);
    }) as ROLE_IDS.CROWN[];
    const results: RoleAssignStats[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const roleId of crownRoles) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.#awardElementalCrownRole(roleId);
      results.push(result);
    }

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

    const abyssClearRow: ButtonActionRow = {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          label: 'Traveler',
          emoji: '😎',
          style: ButtonStyle.Secondary,
          customId: 'traveler',
        },
        {
          type: ComponentType.Button,
          label: 'Conqueror',
          emoji: '🌀',
          style: ButtonStyle.Secondary,
          customId: 'conqueror',
        },
        {
          type: ComponentType.Button,
          label: 'Sovereign',
          emoji: '⚔️',
          style: ButtonStyle.Secondary,
          customId: 'sovereign',
        },
        {
          type: ComponentType.Button,
          label: 'No Change',
          emoji: '😅',
          style: ButtonStyle.Primary,
          customId: 'no_change',
        },
        {
          type: ComponentType.Button,
          label: 'Criteria not Satisfied!',
          emoji: '❌',
          style: ButtonStyle.Danger,
          customId: 'not_satisfied',
        },
      ],
    };
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
      .then(async (msg) => {
        await msg
          .awaitMessageComponent({
            async filter(i) {
              await i.deferUpdate();
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

            let result: RoleAssignStats = {
              exp: 0,
              notes: 'none',
              role: '',
              emoji: '🤔',
            };

            if (clearType === 'not_satisfied' || clearType === 'no_change') {
              await restoreRoles('none', this.#member);
              return;
            }
            if (clearType === 'sovereign') {
              conditionals.exp = 5000;
              conditionals.notes = 'Cleared with 4 different Traveler elements with 4 different teams with no overlap between teammates';
              conditionals.role = ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN;
              conditionals.emoji = '⚔️';
            }

            if (clearType === 'conqueror') {
              conditionals.exp = 1500;
              conditionals.notes = 'Cleared with 3 different traveler elements';
              conditionals.role = ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR;
              conditionals.emoji = '🌀';
            }
            // Assign default stuff if no condition is satisfied
            result = conditionals;
            await this.#member.roles.add(result.role).then(async (member) => {
              this.#assignStats.push(result);

              await this.#member.roles.remove(Object.values(SpiralAbyss), 'Removing old roles');
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
    if (this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.REPUTATION).map(String))) {
      await this.#awardReputationRoles();
    }

    if (this.#hasSelectedRole(ROLE_IDS.OTHERS.WHALE)) {
      await this.#awardWhaleRole();
    }

    if (this.#hasSelectedRole(ROLE_IDS.CROWN.UNALIGNED)) {
      await this.#awardUnalignedCrownRole();
    }

    if (this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.CROWN).map(String))) {
      await this.#awardElementalCrownRoles();
    }

    if (this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.SpiralAbyss).map(String))) {
      await this.#awardSpiralAbyssRole();
    }

    let totalExp = 0;

    this.#assignStats.forEach((stat) => {
      totalExp += stat.exp;
      const line = `${roleMention(stat.role)}${stat.notes === 'none' ? ' ' : `: ${stat.notes} `}(${
        stat.exp
      })\n`;
      this.#embedDescription += line;
      this.#reactEmoji(stat.emoji);
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
        components: this.#proofMessage
          ? [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  label: 'Jump to User Submission',
                  style: ButtonStyle.Link,
                  url: this.#proofMessage.url,
                },
              ],
            },
          ]
          : [],
        options: {
          fetchReply: true,
        },
      })
      .then(async () => {
        await this.#ctx.followUp({
          flags: MessageFlags.Ephemeral,
          content: `>award ${this.#member.id} ${totalExp}`,
        });
        await this.#ctx.followUp({
          flags: MessageFlags.Ephemeral,
          content:
            'Copy paste that command. And a message by <@485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)',
        });

        this.#reactEmoji('✅');

        if (this.#ctx.isContextMenuCommand()) {
          await this.sendLog();
        }
      });
  }

  async sendLog() {
    const channel = this.#proofMessage?.channel;

    if (!channel) {
      return;
    }

    if (channel.isDMBased()) return;

    if (channel.isVoiceBased()) return;

    if (!channel.isTextBased()) return;

    const embed: APIEmbed = {
      color: COLORS.EMBED_COLOR,
      title: '**Roles successfully rewarded!**',
      description: this.#embedDescription,
    };

    if (channel.isThread()) {
      if (channel.id !== ThreadIds.ROLE_AWARD_LOGS) return;

      channel.send({
        embeds: [embed],
        components: this.#proofMessage
          ? [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  label: 'Jump to User Submission',
                  style: ButtonStyle.Link,
                  url: this.#proofMessage.url,
                },
              ],
            },
          ]
          : undefined,
      });
    } else {
      const thread = await channel.threads.fetch(ThreadIds.ROLE_AWARD_LOGS);

      thread?.send({
        embeds: [embed],
        components: this.#proofMessage
          ? [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  label: 'Jump to User Submission',
                  style: ButtonStyle.Link,
                  url: this.#proofMessage.url,
                },
              ],
            },
          ]
          : undefined,
      });
    }
  }
}
