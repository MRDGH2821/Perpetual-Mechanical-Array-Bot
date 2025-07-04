import type { ChatInputOrContextMenuCommandInteraction } from "@sapphire/discord.js-utilities";
import { pickRandom, range } from "@sapphire/utilities";
import type { APIEmbed, GuildMember, Message } from "discord.js";
import {
  ButtonStyle,
  channelMention,
  ComponentType,
  MessageFlags,
  roleMention,
} from "discord.js";
import { COLORS, EMPTY_STRING, ROLE_IDS, ThreadIds } from "../../lib/Constants.js";
import { pmaLogger } from "../../pma-logger.js";
import type {
  ButtonActionRow,
  RegisterCrownArgs,
} from "../../typeDefs/typeDefs.js";
import { arrayIntersection, isStaff, PMAEventHandler } from "./Utilities.js";

type AssignRoleOptions = {
  interaction: ChatInputOrContextMenuCommandInteraction;
  member: GuildMember;
  message: Message | null | undefined;
  selectedRolesIDs: string[];
}

type RegionEmoji = "⚓" | "⚖️" | "⛩️" | "🌴" | "🕊️" | "🤔";

type CrownEmoji =
  "<:Anemo:803516622772895764>" | "<:Cryo:803516632735154177>" | "<:Dendro:803516669984505856>" | "<:Electro:803516644923146260>" | "<:Geo:803516612430135326>" | "<:Hydro:803516313782714378>" | "<:Pyro:803516441424822303>" | "✨" | "🤔";

type AbyssEmoji = "⚔️" | "🌀" | "🤔" | "😎";

type WhaleEmoji = "🐋" | "🐳" | "💰";

type RoleAssignStats = {
  emoji: AbyssEmoji | CrownEmoji | RegionEmoji | WhaleEmoji | "❌";
  exp: number;
  notes: string;
  role: string;
}

export default class AssignRoles {
  readonly #member: GuildMember;

  #embedDescription: string;

  readonly #proofMessage: AssignRoleOptions["message"];

  readonly #selectedRoleIDs: string[];

  readonly #ctx: ChatInputOrContextMenuCommandInteraction;

  #assignStats: RoleAssignStats[] = [];

  #totalExp = 0;

  constructor(options: AssignRoleOptions) {
    let filteredRoles = options.selectedRolesIDs;

    if (
      options.selectedRolesIDs.includes(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)
    ) {
      const denyList = [
        ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
        ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
      ].map(String);
      filteredRoles = options.selectedRolesIDs.filter(
        (id) => !denyList.includes(id),
      );
    } else if (
      options.selectedRolesIDs.includes(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR)
    ) {
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
    const repRoles = this.#selectedRoleIDs.filter((id) =>
      systemRoles.includes(id),
    );

    await this.#member.roles
      .add(repRoles, "Completed regional exploration & achievements")
      .then(() =>
        { for (const role of repRoles) {
          let emoji: RegionEmoji = "🤔";

          switch (role) {
            case ROLE_IDS.REPUTATION.MONDSTADT: {
              emoji = "🕊️";
              break;
            }

            case ROLE_IDS.REPUTATION.LIYUE: {
              emoji = "⚖️";
              break;
            }

            case ROLE_IDS.REPUTATION.INAZUMA: {
              emoji = "⛩️";
              break;
            }

            case ROLE_IDS.REPUTATION.SUMERU: {
              emoji = "🌴";
              break;
            }

            case ROLE_IDS.REPUTATION.FONTAINE: {
              emoji = "⚓";
              break;
            }

            default: {
              emoji = "🤔";
              break;
            }
          }

          this.#assignStats.push({
            exp: 250,
            notes: "none",
            role,
            emoji,
          });
        } },
      );
  }

  async #awardWhaleRole() {
    const { WHALE } = ROLE_IDS.OTHERS;
    const WhaleEmojis: WhaleEmoji[] = ["🐋", "🐳", "💰"];
    await this.#member.roles
      .add(WHALE, "Spent some excess dollars in game....")
      .then(() =>
        this.#assignStats.push({
          exp: 250,
          notes: "none",
          role: WHALE,
          emoji: pickRandom(WhaleEmojis),
        }),
      );
  }

  async #awardUnalignedCrownRole() {
    const { UNALIGNED } = ROLE_IDS.CROWN;
    await this.#member.roles.add(UNALIGNED, "Crowned The Traveler").then(() => {
      AssignRoles.registerCrown({
        crownID: UNALIGNED,
        quantity: 1,
        target: this.#member,
      });
      return this.#assignStats.push({
        exp: 30_000,
        notes: "Paid attention in the game!",
        role: UNALIGNED,
        emoji: "✨",
      });
    });
  }

  static registerCrown(args: RegisterCrownArgs) {
    PMAEventHandler.emit("RegisterCrown", args);
  }

  async #reactEmoji(emoji: string) {
    return this.#proofMessage?.react(emoji);
  }

  async #awardElementalCrownRole(
    roleID: ROLE_IDS.CROWN,
  ): Promise<RoleAssignStats> {
    const props: {
      color: COLORS;
      emoji: CrownEmoji;
    } = {
      color: COLORS.EMBED_COLOR,
      emoji: "🤔",
    };

    if (roleID === ROLE_IDS.CROWN.ANEMO) {
      props.color = COLORS.ANEMO;
      props.emoji = "<:Anemo:803516622772895764>";
    }

    if (roleID === ROLE_IDS.CROWN.GEO) {
      props.color = COLORS.GEO;
      props.emoji = "<:Geo:803516612430135326>";
    }

    if (roleID === ROLE_IDS.CROWN.ELECTRO) {
      props.color = COLORS.ELECTRO;
      props.emoji = "<:Electro:803516644923146260>";
    }

    if (roleID === ROLE_IDS.CROWN.DENDRO) {
      props.color = COLORS.DENDRO;
      props.emoji = "<:Dendro:803516669984505856>";
    }

    if (roleID === ROLE_IDS.CROWN.HYDRO) {
      props.color = COLORS.HYDRO;
      props.emoji = "<:Hydro:803516313782714378>";
    }

    return new Promise((resolve, reject) => {
      const crownAmtRow: ButtonActionRow = {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            emoji: "1️⃣",
            style: ButtonStyle.Secondary,
            customId: `crown_${this.#member.id}_1`,
          },
          {
            type: ComponentType.Button,
            emoji: "2️⃣",
            style: ButtonStyle.Secondary,
            customId: `crown_${this.#member.id}_2`,
          },
          {
            type: ComponentType.Button,
            emoji: "3️⃣",
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
              title: "**How many Crowns?**",
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
        .then(async (msg) =>
          msg.awaitMessageComponent({
            async filter(i) {
              await i.deferUpdate();
              if (i.member) {
                return isStaff(i.member);
              }

              return false;
            },
            componentType: ComponentType.Button,
            dispose: true,
          }),
        )
        .then(async (btnCtx) => {
          const quantity = Number.parseInt(btnCtx.customId.at(-1) || "1", 10);
          let exp = 250;
          for (const number of range(1, quantity, 1)) {
            exp *= number;
          }

          AssignRoles.registerCrown({
            crownID: roleID,
            quantity,
            target: this.#member,
          });
          return this.#member.roles.add(roleID).then(() => resolve({
              exp,
              notes: `${quantity} crown(s)`,
              role: roleID,
              emoji: props.emoji,
            }));
        })
        .catch(reject);
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

     
    for (const roleId of crownRoles) {
       
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

    let previousRole = "none";
    if (beforeRemoval.sovereign) {
      previousRole = roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN);
    } else if (beforeRemoval.conqueror) {
      previousRole = roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR);
    } else if (beforeRemoval.traveler) {
      previousRole = roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER);
    }

    await this.#member.roles.remove(
      Object.values(SpiralAbyss),
      "Removing old roles",
    );

    async function restoreRoles(newRoleID: string, target: GuildMember) {
      if (
        beforeRemoval.sovereign ||
        newRoleID === ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN
      ) {
        return target.roles.add(
          ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN,
          "Cleared Spiral Abyss at Sovereign Difficulty",
        );
      }

      if (
        beforeRemoval.conqueror ||
        newRoleID === ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR
      ) {
        return target.roles.add(
          ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR,
          "Cleared Spiral Abyss at Conqueror Difficulty",
        );
      }

      if (
        beforeRemoval.traveler ||
        newRoleID === ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER
      ) {
        return target.roles.add(
          ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
          "Cleared Spiral Abyss at Traveler Difficulty",
        );
      }

      return new Promise((resolve) => {
        resolve("No roles assigned");
      });
    }

    const abyssClearRow: ButtonActionRow = {
      type: ComponentType.ActionRow,
      components: [
        {
          type: ComponentType.Button,
          label: "Traveler",
          emoji: "😎",
          style: ButtonStyle.Secondary,
          customId: "traveler",
        },
        {
          type: ComponentType.Button,
          label: "Conqueror",
          emoji: "🌀",
          style: ButtonStyle.Secondary,
          customId: "conqueror",
        },
        {
          type: ComponentType.Button,
          label: "Sovereign",
          emoji: "⚔️",
          style: ButtonStyle.Secondary,
          customId: "sovereign",
        },
        {
          type: ComponentType.Button,
          label: "No Change",
          emoji: "😅",
          style: ButtonStyle.Primary,
          customId: "no_change",
        },
        {
          type: ComponentType.Button,
          label: "Criteria not Satisfied!",
          emoji: "❌",
          style: ButtonStyle.Danger,
          customId: "not_satisfied",
        },
      ],
    };
    await this.#ctx
      .editReply({
        embeds: [
          {
            title: "**Cleared Spiral Abyss?**",
            color: COLORS.EMBED_COLOR,
            description: `How did ${this.#member} satisfy the Condition?\nPrevious Role: ${previousRole}`,
            fields: [
              {
                name: "Abyssal Traveler 😎",
                value: "Cleared with Traveler",
              },
              {
                name: "Abyssal Conqueror 🌀",
                value: "Cleared with 3 different traveler elements",
              },
              {
                name: "Abyssal Sovereign ⚔️",
                value:
                  "Cleared with 4 different Traveler elements with 4 different teams with no overlap between teammates",
              },
            ],
          },
        ],
        components: [abyssClearRow],
        options: {
          fetchReply: true,
        },
      })
      .then(async (msg) =>
        msg.awaitMessageComponent({
          async filter(i) {
            await i.deferUpdate();
            if (i.member) {
              return isStaff(i.member);
            }

            return false;
          },
          componentType: ComponentType.Button,
        }),
      )
      .then(async (btnCtx) => {
        const clearType = btnCtx.customId;

        const conditionals: RoleAssignStats = {
          exp: 500,
          notes: "Cleared 36/36 with Traveler",
          role: ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER,
          emoji: "😎",
        };

        let result: RoleAssignStats = {
          exp: 0,
          notes: "none",
          role: "",
          emoji: "🤔",
        };

        if (clearType === "not_satisfied" || clearType === "no_change") {
          await restoreRoles("none", this.#member);
          return null;
        }

        if (clearType === "sovereign") {
          conditionals.exp = 5_000;
          conditionals.notes =
            "Cleared with 4 different Traveler elements with 4 different teams with no overlap between teammates";
          conditionals.role = ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN;
          conditionals.emoji = "⚔️";
        }

        if (clearType === "conqueror") {
          conditionals.exp = 1_500;
          conditionals.notes = "Cleared with 3 different traveler elements";
          conditionals.role = ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR;
          conditionals.emoji = "🌀";
        }

        // Assign default stuff if no condition is satisfied
        result = conditionals;
        return this.#member.roles.add(result.role).then(async (member) => {
          this.#assignStats.push(result);

          await this.#member.roles.remove(
            Object.values(SpiralAbyss),
            "Removing old roles",
          );
          return restoreRoles(conditionals.role, member);
        });
      })
      .catch((error) => pmaLogger.error(error));
  }

  #hasSelectedRolesFrom(arr: unknown[]): boolean {
    return arrayIntersection(this.#selectedRoleIDs, arr).length > 0;
  }

  #hasSelectedRole(roleID: string) {
    return this.#selectedRoleIDs.includes(roleID);
  }

  async awardRoles() {
    if (
      this.#hasSelectedRolesFrom(Object.values(ROLE_IDS.REPUTATION).map(String))
    ) {
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

    if (
      this.#hasSelectedRolesFrom(
        Object.values(ROLE_IDS.SpiralAbyss).map(String),
      )
    ) {
      await this.#awardSpiralAbyssRole();
    }

    for (const stat of this.#assignStats) {
      this.#totalExp += stat.exp;
      const line = `${roleMention(stat.role)}${stat.notes === "none" ? " " : `: ${stat.notes} `}(${
        stat.exp
      })\n`;
      this.#embedDescription += line;
      this.#reactEmoji(stat.emoji);
    }

    this.#embedDescription += `\n**Total exp:** ${this.#totalExp}`;

    await this.#ctx
      .editReply({
        content: EMPTY_STRING,
        embeds: [
          {
            color: COLORS.EMBED_COLOR,
            title: "**Roles successfully rewarded!**",
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
                    label: "Jump to User Submission",
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
        if (this.#totalExp === 0) {
          return this.#ctx.followUp({
            content: "No roles were actually awarded.",
            flags: MessageFlags.Ephemeral,
          });
          // return;
        }

        this.#reactEmoji("✅");

        if (this.#ctx.isContextMenuCommand()) {
          await this.sendLog();
        }

        await this.#ctx.followUp({
          flags: MessageFlags.Ephemeral,
          content: `>award ${this.#member.id} ${this.#totalExp}`,
        });
        return this.#ctx.followUp({
          flags: MessageFlags.Ephemeral,
          content: `Copy that command and paste at ${channelMention(
            ThreadIds.ROLE_AWARD_LOGS,
          )}. Then a message by <@485962834782453762> should come up like [this](https://i.imgur.com/yQvOAzZ.png)`,
        });
      });
  }

  async sendLog() {
    if (this.#totalExp < 1) return;

    const channel = this.#proofMessage?.channel;

    if (!channel) return;

    if (channel.isDMBased()) return;

    if (channel.isVoiceBased()) return;

    if (!channel.isTextBased()) return;

    const embed: APIEmbed = {
      color: COLORS.EMBED_COLOR,
      title: "**Roles successfully rewarded!**",
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
                    label: "Jump to User Submission",
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
                    label: "Jump to User Submission",
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
