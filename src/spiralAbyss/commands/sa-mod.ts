import { container } from "@sapphire/pieces";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Time } from "@sapphire/time-utilities";
import type { APIEmbed, Message } from "discord.js";
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  channelMention,
  ChannelType,
  ComponentType,
  MessageFlags,
  roleMention,
} from "discord.js";
import {
  guildMessageIDsExtractor,
  isStaff,
  PMAEventHandler,
} from "../../baseBot/lib/Utilities.js";
import { ChannelIds, COLORS, ICONS, ROLE_IDS } from "../../lib/Constants.js";
import EnvConfig from "../../lib/EnvConfig.js";
import type { ButtonActionRow, JSONCmd } from "../../typeDefs/typeDefs.js";
import SpiralAbyssCache from "../lib/SpiralAbyssCache.js";
import TravelerTeam from "../lib/TravelerTeam.js";

const cmdDef: JSONCmd = {
  name: "sa-mod",
  description: "Spiral Abyss mod only commands",
  options: [
    {
      type: 1,
      name: "refresh",
      description: "Refreshes Spiral Abyss cache",
    },
    {
      type: 1,
      name: "publish",
      description: "Publishes the names of crown role holders",
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "setup",
      description: "Setup Spiral Abyss channel",
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "forum_channel",
          description:
            "Select the forum channel where the updates will be posted",
          required: true,
          channel_types: [ChannelType.GuildForum],
          channelTypes: [ChannelType.GuildForum],
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "reset",
      description: "Use when Spiral Abyss enemies have changed",
      options: [
        {
          name: "remove_roles",
          description:
            "Announces reset then Removes the spiral abyss role from members",
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
        {
          name: "publish_names",
          description:
            "Publishes names of travelers who cleared Spiral Abyss 36/36 (default True)",
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          name: "send_announcement",
          description: "Will send an announcement (default True)",
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          name: "announce_with_ping",
          description: "Will announce with a ping (default False)",
          type: ApplicationCommandOptionType.Boolean,
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "restore_backup",
      description: "Restore Spiral Abyss Backup",
      options: [
        {
          type: ApplicationCommandOptionType.Attachment,
          name: "backup_file",
          description: "Upload the backup file",
          required: true,
        },
      ],
    },
    {
      name: "announce-sovereign",
      description: "Announce the new Abyssal Sovereign",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "proof_link",
          description: "Link to the proof of achievement",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};
export default class GuildCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      preconditions: ["ModOnly"],
      subcommands: [
        {
          name: cmdDef.options![0]!.name,
          type: "method",
          async chatInputRun(interaction) {
            PMAEventHandler.emit("SARefresh");
            return interaction.reply({
              content:
                "Refresh initiated, please wait for a while before using Spiral Abyss commands!",
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![1]!.name,
          type: "method",
          async chatInputRun(interaction) {
            PMAEventHandler.emit("SAPublish");
            return interaction.reply({
              content: "Spiral Abyss will be published soon.",
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![2]!.name,
          type: "method",
          async chatInputRun(interaction) {
            const forumChannel =
              interaction.options.getChannel<ChannelType.GuildForum>(
                "forum_channel",
                true,
                [ChannelType.GuildForum],
              );

            PMAEventHandler.emit("SASetup", forumChannel);
            return interaction.reply({
              content: `Spiral Abyss updates will now arrive in ${forumChannel}`,
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![3]!.name,
          type: "method",
          async chatInputRun(interaction) {
            const shouldRemoveRoles = interaction.options.getBoolean(
              "remove_roles",
              true,
            );
            const shouldPublishNames =
              interaction.options.getBoolean("publish_names");
            const shouldSendAnnouncement =
              interaction.options.getBoolean("send_announcement");
            const shouldAnnounceWithPing =
              interaction.options.getBoolean("announce_with_ping");

            const status = `1. Will publish names: \`${shouldPublishNames}\`\n2. Will remove roles: \`${shouldRemoveRoles}\`\n3. Send Announcement message: \`${shouldSendAnnouncement}\` \n4. Will Announce with ping: \`${shouldAnnounceWithPing}\``;

            const verifyEmb: APIEmbed = {
              title: "**Are you sure?**",
              description: `Performing This action will result in the following -\n ${status}`,
              color: COLORS.EMBED_COLOR,
              thumbnail: {
                url: "",
              },
            };

            const verifyRow: ButtonActionRow = {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  label: "Yes, do it!",
                  emoji: "✅",
                  style: ButtonStyle.Danger,
                  customId: "confirm_reset",
                },
                {
                  type: ComponentType.Button,
                  label: "No, I was going to do a mistake!",
                  emoji: "❌",
                  style: ButtonStyle.Success,
                  customId: "skip_reset",
                },
              ],
            };

            return interaction
              .reply({
                embeds: [verifyEmb],
                components: [verifyRow],
                flags: MessageFlags.Ephemeral,
              })
              .then(async (msg) =>
                msg.awaitMessageComponent({
                  componentType: ComponentType.Button,
                  dispose: true,
                  async filter(itx) {
                    await itx.deferUpdate();
                    return isStaff(itx.member);
                  },
                }),
              )
              .then(async (btnCtx) => {
                PMAEventHandler.emit("SABackup");
                if (btnCtx.customId === "confirm_reset") {
                  const successEmbed: APIEmbed = {
                    title: "**Success**",
                    description: status,
                    color: COLORS.SUCCESS,
                    thumbnail: {
                      url: ICONS.CHECK_MARK,
                    },
                    fields: [
                      {
                        name: "**Done**",
                        value: `Your command was successfully executed!\nBackup Files will be sent into ${channelMention(
                          ChannelIds.ARCHIVES,
                        )}`,
                      },
                    ],
                  };

                  if (shouldPublishNames) {
                    PMAEventHandler.emit("SAPublish");
                  }

                  if (shouldSendAnnouncement) {
                    const announceEmb: APIEmbed = {
                      title: "**New Enemy Lineup!**",
                      color: COLORS.SPIRAL_ABYSS,
                      description: `Enemy Lineup has changed which means Spiral abyss roles are up for grabs!\nSubmit in-game screenshot or Hoyolab profile link or Hoyolab screenshot at <#${ChannelIds.ROLE_APPLICATION}> as a proof to get the role!\n\nRequirements for obtaining respective roles:`,
                      fields: [
                        {
                          name: "Abyssal Traveler",
                          value:
                            "Complete Spiral Abyss 36/36 stars with Traveler\nTotal exp: `500`",
                        },
                        {
                          name: "Abyssal Conqueror",
                          value:
                            "Above requirements + using at least three different Traveler elements*.\nTotal exp: `1500`",
                        },
                        {
                          name: "Abyssal Sovereign",
                          value:
                            "Complete 36/36 stars with all traveler elements having different teams with no overlap between teammates*.\nTotal exp: `5000`",
                        },
                        {
                          name: "\u200B",
                          value: shouldRemoveRoles
                            ? "||*Yes roles were removed but none of the animals were harmed in this process.*||"
                            : "*No roles were removed nor any animals were hurt in this process.*",
                        },
                      ],
                      footer: {
                        text: "*Needs Video Proof at Role Application Channel",
                      },
                    };

                    const channel = await container.client.channels.fetch(
                      ChannelIds.SPIRAL_ABYSS,
                    );

                    if (!channel?.isTextBased()) {
                      throw new Error("Need text channel to announce");
                    }

                    if (!channel.isSendable()) {
                      throw new Error("Channel is not sendable");
                    }

                    void channel.send({
                      content: shouldAnnounceWithPing
                        ? roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER) +
                          roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR) +
                          roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)
                        : roleMention(ROLE_IDS.OTHERS.ARCHONS),
                      embeds: [announceEmb],
                      components: [],
                    });
                  }

                  if (shouldRemoveRoles) {
                    void SpiralAbyssCache.removeRoles();
                  }

                  return btnCtx.editReply({
                    embeds: [successEmbed],
                    components: [],
                  });
                }

                verifyEmb.fields?.push({
                  name: "**Not Done**",
                  value: "Your command was not executed",
                });
                verifyEmb.color = COLORS.ERROR;
                verifyEmb.thumbnail!.url = ICONS.CROSS_MARK;
                return btnCtx.editReply({
                  embeds: [verifyEmb],
                  components: [],
                });
              });
          },
        },
        {
          name: cmdDef.options![4]!.name,
          type: "method",
          async chatInputRun(interaction) {
            const backupFile = interaction.options.getAttachment(
              "backup_file",
              true,
            );

            PMAEventHandler.emit("SARestore", {
              backupFile,
              user: interaction.user,
            });

            return interaction.reply({
              content: "Backup will be restored soon & you will be notified",
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![5]!.name,
          type: "method",
          async chatInputRun(interaction) {
            const proofLink = interaction.options.getString("proof_link", true);

            if (
              !interaction.inCachedGuild() ||
              !interaction.inGuild() ||
              !interaction.guild
            ) {
              return interaction.reply({
                content: "This command is only available in the server",
                flags: MessageFlags.Ephemeral,
              });
            }

            if (interaction.channelId !== ChannelIds.COMMAND_CENTER) {
              return interaction.reply({
                content: `Please use this command inside ${channelMention(
                  ChannelIds.COMMAND_CENTER,
                )} channel`,
                flags: MessageFlags.Ephemeral,
              });
            }

            let proofMessage: Message | null = null;
            const ids = guildMessageIDsExtractor(proofLink);
            const channel = await interaction.guild.channels.fetch(
              ids.channelId!,
            );

            if (channel?.isTextBased()) {
              proofMessage = await channel.messages.fetch(ids.messageId!);
            }

            if (!proofMessage) {
              return interaction.reply({
                content: "Proof Message not found",
                flags: MessageFlags.Ephemeral,
              });
            }

            await interaction.deferReply();

            await interaction.editReply({
              content: "Let's construct a message...",
            });

            const user = proofMessage.author;
            const team1 = await new TravelerTeam(interaction, user).buildTeam();
            const team2 = await new TravelerTeam(interaction, user, [
              team1.element!,
            ]).buildTeam();
            const team3 = await new TravelerTeam(interaction, user, [
              team1.element!,
              team2.element!,
            ]).buildTeam();
            const team4 = await new TravelerTeam(interaction, user, [
              team1.element!,
              team2.element!,
              team3.element!,
            ]).buildTeam();

            const announceEmbed: APIEmbed = {
              title: "A new Abyssal Sovereign has risen!",
              color: 0x5f7eb1,
              description: `Congratulations ${user} for getting ${roleMention(
                ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN,
              )}!\n\n__Teams they used:__\n${team1.toString()}\n${team2.toString()}\n${team3.toString()}\n${team4.toString()}`,
            };

            const announcementChannel = await interaction.guild.channels.fetch(
              ChannelIds.ANNOUNCEMENT,
            );
            if (!announcementChannel?.isTextBased()) {
              throw new Error("Need text channel to announce");
            }

            const prompt = await interaction
              .editReply({
                content: `Message constructed!\n\nSend message at ${announcementChannel} ?`,
                embeds: [announceEmbed],
                components: [
                  {
                    type: ComponentType.ActionRow,
                    components: [
                      {
                        type: ComponentType.Button,
                        label: "Send",
                        style: ButtonStyle.Success,
                        customId: "send",
                      },
                      {
                        type: ComponentType.Button,
                        label: "Cancel",
                        style: ButtonStyle.Danger,
                        customId: "cancel",
                      },
                    ],
                  },
                ],
              })
              .then(async (msg) =>
                msg.awaitMessageComponent({
                  async filter(itx) {
                    await itx.deferUpdate();
                    if (itx.member) {
                      return isStaff(itx.member);
                    }

                    return false;
                  },
                  time: 3 * Time.Minute,
                }),
              );
            if (prompt.customId === "cancel") {
              return prompt.editReply({
                content: "Cancelled",
                components: [],
              });
            }

            await prompt.editReply({
              content: "Sending message...",
              components: [],
            });
            const announceMsg = await announcementChannel.send({
              embeds: [announceEmbed],
              components: [
                {
                  type: ComponentType.ActionRow,
                  components: [
                    {
                      type: ComponentType.Button,
                      label: "Watch their Attempt",
                      style: ButtonStyle.Link,
                      url: proofMessage.url,
                    },
                  ],
                },
              ],
            });

            return prompt.editReply({
              content: `Message sent at ${announcementChannel}!`,
              components: [
                {
                  type: ComponentType.ActionRow,
                  components: [
                    {
                      type: ComponentType.Button,
                      label: "View Message",
                      style: ButtonStyle.Link,
                      url: announceMsg.url,
                    },
                  ],
                },
              ],
            });
          },
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
