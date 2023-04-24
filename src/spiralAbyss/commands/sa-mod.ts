import { container } from '@sapphire/pieces';
import { Subcommand } from '@sapphire/plugin-subcommands';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  MessageFlags,
  channelMention,
  roleMention,
  type APIEmbed,
} from 'discord.js';
import { PMAEventHandler, isStaff } from '../../baseBot/lib/Utilities';
import { COLORS, ChannelIds, ICONS, ROLE_IDS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import SpiralAbyssCache from '../lib/SpiralAbyssCache';

const cmdDef: JSONCmd = {
  name: 'sa-mod',
  description: 'Spiral Abyss mod only commands',
  options: [
    {
      type: 1,
      name: 'refresh',
      description: 'Refreshes Spiral Abyss cache',
    },
    {
      type: 1,
      name: 'publish',
      description: 'Publishes the names of crown role holders',
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'setup',
      description: 'Setup Spiral Abyss channel',
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: 'forum_channel',
          description: 'Select the forum channel where the updates will be posted',
          required: true,
          channel_types: [ChannelType.GuildForum],
          channelTypes: [ChannelType.GuildForum],
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: 'reset',
      description: 'Use when Spiral Abyss enemies have changed',
      options: [
        {
          name: 'remove_roles',
          description: 'Announces reset then Removes the spiral abyss role from members',
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
        {
          name: 'publish_names',
          description: 'Publishes names of travelers who cleared Spiral Abyss 36/36 (default True)',
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          name: 'send_announcement',
          description: 'Will send an announcement (default True)',
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          name: 'announce_with_ping',
          description: 'Will announce with a ping (default False)',
          type: ApplicationCommandOptionType.Boolean,
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
      preconditions: ['ModOnly'],
      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          chatInputRun(interaction) {
            PMAEventHandler.emit('SARefresh');
            return interaction.reply({
              content:
                'Refresh initiated, please wait for a while before using Spiral Abyss commands!',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun(interaction) {
            PMAEventHandler.emit('SAPublish');
            return interaction.reply({
              content: 'Spiral Abyss will be published soon.',
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![2].name,
          type: 'method',
          chatInputRun(interaction) {
            const forumChannel = interaction.options.getChannel<ChannelType.GuildForum>(
              'forum_channel',
              true,
              [ChannelType.GuildForum],
            );

            PMAEventHandler.emit('SASetup', forumChannel);
            return interaction.reply({
              content: `Spiral Abyss updates will now arrive in ${forumChannel}`,
              flags: MessageFlags.Ephemeral,
            });
          },
        },
        {
          name: cmdDef.options![3].name,
          type: 'method',
          async chatInputRun(interaction) {
            const shouldRemoveRoles = interaction.options.getBoolean('remove_roles', true);
            const shouldPublishNames = interaction.options.getBoolean('publish_names') || true;
            const shouldSendAnnouncement =
              interaction.options.getBoolean('send_announcement') || true;
            const shouldAnnounceWithPing =
              interaction.options.getBoolean('announce_with_ping') || false;

            const status = `1. Will publish names: \`${shouldPublishNames}\`\n 2. Will remove roles: \`${shouldRemoveRoles}\`\n 3. Send Announcement message: \`${shouldSendAnnouncement}\` \n 4. Will Announce with ping: \`${shouldAnnounceWithPing}\``;

            const verifyEmb: APIEmbed = {
              title: '**Are you sure?**',
              description: `Performing This action will result in the following -\n ${status}`,
              color: COLORS.EMBED_COLOR,
              thumbnail: {
                url: '',
              },
            };

            const verifyRow = new ActionRowBuilder<ButtonBuilder>({
              type: ComponentType.ActionRow,
              components: [
                new ButtonBuilder({
                  label: 'Yes, do it!',
                  emoji: '✅',
                  style: ButtonStyle.Danger,
                }).setCustomId('confirm_reset'),
                new ButtonBuilder({
                  label: 'No, I was going to do a mistake!',
                  emoji: '❌',
                  style: ButtonStyle.Success,
                }).setCustomId('skip_reset'),
              ],
            });

            return interaction
              .reply({
                embeds: [verifyEmb],
                components: [verifyRow],
                flags: MessageFlags.Ephemeral,
              })
              .then((msg) =>
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
                if (btnCtx.customId === 'confirm_reset') {
                  const successEmbed: APIEmbed = {
                    title: '**Success**',
                    description: status,
                    color: COLORS.SUCCESS,
                    thumbnail: {
                      url: ICONS.CHECK_MARK,
                    },
                    fields: [
                      {
                        name: '**Done**',
                        value: `Your command was successfully executed!\nBackup Files will be sent into ${channelMention(
                          ChannelIds.ARCHIVES,
                        )}`,
                      },
                    ],
                  };

                  if (shouldPublishNames) {
                    PMAEventHandler.emit('SAPublish');
                  }

                  if (shouldSendAnnouncement) {
                    const announceEmb: APIEmbed = {
                      title: '**New Enemy Lineup!**',
                      color: COLORS.SPIRAL_ABYSS,
                      description: `Enemy Lineup has changed which means Spiral abyss roles are up for grabs!\nSubmit in-game screenshot or Hoyolab profile link or Hoyolab screenshot at <#${ChannelIds.ROLE_APPLICATION}> as a proof to get the role!\n\nRequirements for obtaining respective roles:`,
                      fields: [
                        {
                          name: 'Abyssal Traveler',
                          value:
                            'Complete Spiral Abyss 36/36 stars with Traveler\nTotal exp: `500`',
                        },
                        {
                          name: 'Abyssal Conqueror',
                          value:
                            'Above requirements + using at least three different Traveler elements*.\nTotal exp: `1500`',
                        },
                        {
                          name: 'Abyssal Sovereign',
                          value:
                            'Complete 36/36 stars with at least four different elements & four different teams with no overlap between teammates*.\nTotal exp: `5000`',
                        },
                        {
                          name: '\u200B',
                          value: shouldRemoveRoles
                            ? '||*Yes roles were removed and none of the animals were harmed in this process.*||'
                            : '*No roles were removed nor any animals were hurt in this process.*',
                        },
                      ],
                      footer: {
                        text: `*Needs video proof at <#${ChannelIds.ROLE_APPLICATION}>`,
                      },
                    };

                    const channel = await container.client.channels.fetch(ChannelIds.SPIRAL_ABYSS);

                    if (!channel?.isTextBased()) {
                      throw new Error('Need text channel to announce');
                    }

                    channel.send({
                      content: shouldAnnounceWithPing
                        ? roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_TRAVELER) +
                          roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_CONQUEROR) +
                          roleMention(ROLE_IDS.SpiralAbyss.ABYSSAL_SOVEREIGN)
                        : roleMention(ROLE_IDS.OTHERS.ARCHONS),
                      embeds: [announceEmb],
                    });
                  }

                  if (shouldRemoveRoles) {
                    SpiralAbyssCache.removeRoles();
                  }

                  return btnCtx.editReply({
                    embeds: [successEmbed],
                  });
                }
                verifyEmb.fields?.push({
                  name: '**Not Done**',
                  value: 'Your command was not executed',
                });
                verifyEmb.color = COLORS.ERROR;
                verifyEmb.thumbnail!.url = ICONS.CROSS_MARK;
                return btnCtx.editReply({
                  embeds: [verifyEmb],
                });
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
