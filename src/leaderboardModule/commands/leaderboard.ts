import {
  ApplicationCommandOptionTypes,
  ChannelTypes,
  InteractionCallbackTypes,
  MessageComponentButtonStyles,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Channel } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { LeaderBoardArgs, SimpleEmbed } from '../../botTypes/interfaces';
import {
  ElementDamageCategories,
  GroupCategoryType,
  LeaderboardDBOptions,
} from '../../botTypes/types';
import {
  ChannelIds, COLORS, ICONS, LEADERBOARD_ELE_CATEGORY_CHOICES,
} from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import db from '../../lib/Firestore';
import {
  isLBRefreshComplete,
  leaderboardViewGenerate,
  showcaseLeaderboardGenerate,
} from '../../lib/leaderboardCacheManager';
import {
  Debugging,
  extractLinks,
  PMAEventHandler,
  randomSkillIcon,
  StaffCheck,
  viewPages,
} from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'leaderboard',
  description: 'Leaderboard commands',
  global: false,
  guildIds: [EnvConfig.guildId],
  async onBeforeRun(ctx) {
    if (!isLBRefreshComplete()) {
      ctx.editOrRespond({
        content: 'Please wait before using this command, refresh is not complete',
        flags: MessageFlags.EPHEMERAL,
      });
    }

    return isLBRefreshComplete();
  },
  options: [
    {
      name: 'register',
      description: 'Register score',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'contestant',
          description: 'Who made the score? (User ID can also be put)',
          required: true,
          type: ApplicationCommandOptionTypes.USER,
        },
        {
          name: 'element_category',
          description: 'Which element was used?',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: LEADERBOARD_ELE_CATEGORY_CHOICES,
        },
        {
          name: 'type_category',
          description: 'Whether this score was made solo or not',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            { name: 'Solo', value: 'solo' },
            { name: 'Open', value: 'open' },
          ],
        },
        {
          name: 'score',
          description: 'Score i.e. Damage value',
          type: ApplicationCommandOptionTypes.NUMBER,
          required: true,
        },
        {
          name: 'proof_link',
          description: 'Upload proof on traveler showcase channel & copy link to message',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
        },
      ],
      onBeforeRun(ctx, args: LeaderBoardArgs) {
        if (args.contestant?.bot === true || !args.proof_link?.includes(ChannelIds.SHOWCASE)) {
          ctx.editOrRespond({
            embed: {
              color: COLORS.ERROR,
              title: '**ERROR!**',
              thumbnail: { url: ICONS.CROSS_MARK },
              description: `Make sure the contestant is not a bot. \nAnd the proof link is from <#${ChannelIds.SHOWCASE}>\n\n**Contestant**: ${args.contestant?.mention} ${args.contestant?.tag} \n**Category**: ${args.element_category} \n**Group**: ${args.type_category} \n**Score (i.e. Dmg value)**: ${args.score} \n\n**Proof**: \n${args.proof_link}`,
            },
          });
          return false;
        }
        return true;
      },
      async run(ctx, args: LeaderBoardArgs) {
        const dmgCategory = args.element_category!;

        const msgIds = args.proof_link?.match(/\d+/gm)!;
        const leaderBoardChannel = ctx.guild?.channels.get(ChannelIds.SHOWCASE);
        const proofMsg = await leaderBoardChannel!.fetchMessage(msgIds[msgIds.length - 1]);

        const verifyEmb: SimpleEmbed = {
          title: '**Entry Verification**',
          color: COLORS.EMBED_COLOR,
          description: `**Contestant**: ${args.contestant?.mention} \`${args.contestant?.tag}\` \n**Category**: ${dmgCategory} \n**Group**: ${args.type_category} \n**Score (i.e. Dmg value)**: ${args.score} \n\n**Proof**: \n${args.proof_link}`,
          fields: [],
          image: {
            url: '',
          },
          video: {
            url: '',
          },
        };

        try {
          const { author, content, attachments } = proofMsg;

          const attURL = attachments.first()?.url;
          verifyEmb.image = { url: attURL };

          Debugging.leafDebug(attachments);
          verifyEmb.fields?.push(
            {
              name: '**Auto verification**',
              value: `**Contestant**: ${
                author.id === args.contestant?.id
                  ? 'Verified'
                  : `Cannot Verify (most likely submission done on behalf of ${args.contestant?.tag} by ${author.tag})`
              }\n**Score**: ${
                content.match(`${args.score}`)?.length
                  ? 'Verified'
                  : "Cannot Verify (most likely because contestant didn't put score as text while uploading proof)"
              }`,
            },
            {
              name: '**Attachments direct link**',
              value: `Link 1: ${
                attachments.first()?.url || 'Failed to get attachment url'
              }\nLink 2: ${attachments.first()?.proxyUrl || 'Failed to get attachment url'}`,
            },
          );
        } catch (err) {
          console.error(err);
          Debugging.leafDebug(err);
        }

        // Add elemental colour
        if (/anemo./gimu.test(dmgCategory)) {
          verifyEmb.color = COLORS.ANEMO;
          verifyEmb.thumbnail = { url: randomSkillIcon('anemo') };
        } else if (/geo./gimu.test(dmgCategory)) {
          verifyEmb.color = COLORS.GEO;
          verifyEmb.thumbnail = { url: randomSkillIcon('geo') };
        } else if (/electro./gimu.test(dmgCategory)) {
          verifyEmb.color = COLORS.ELECTRO;
          verifyEmb.thumbnail = { url: randomSkillIcon('electro') };
        } else if (/uni./gimu.test(dmgCategory)) {
          verifyEmb.color = COLORS.UNIVERSAL;
          verifyEmb.thumbnail = { url: ICONS.COPIUM };
        } else {
          verifyEmb.color = COLORS.EMBED_COLOR;
          verifyEmb.thumbnail = { url: ICONS.VOID };
        }

        const approveRow = new ComponentActionRow()
          .addButton({
            customId: 'accepted',
            label: 'Accept',
            emoji: '👍',
            style: MessageComponentButtonStyles.SUCCESS,
            async run(btnCtx) {
              verifyEmb.thumbnail = { url: ICONS.CHECK_MARK };
              verifyEmb.title = '**Submission Accepted!**';
              verifyEmb.color = COLORS.SUCCESS;
              if (!StaffCheck.isStaff(btnCtx.member!)) {
                await btnCtx.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                  content: 'Ping a mod to get approval!',
                  flags: MessageFlags.EPHEMERAL,
                });
                return;
              }
              await btnCtx.editOrRespond({
                embeds: [verifyEmb],
              });

              const registration: LeaderboardDBOptions = {
                elementCategory: dmgCategory,
                proof: args.proof_link!,
                score: args.score!,
                typeCategory: args.type_category!,
                userID: args.contestant?.id!,
              };

              await db
                .collection(`${registration.elementCategory}-${registration.typeCategory}`)
                .doc(registration.userID)
                .set(registration)
                .then(() => console.log('Leaderboard Entry Submitted!'))
                .catch((err) => {
                  console.log('Error while submitting leaderboard entry');
                  Debugging.leafDebug(err, true);
                });
              PMAEventHandler.emit('leaderboardRefresh', true);
              proofMsg.react('✅').catch((err) => {
                Debugging.leafDebug(err, true);
              });
            },
          })
          .addButton({
            customId: 'declined',
            label: 'Decline',
            emoji: '👎',
            style: MessageComponentButtonStyles.DANGER,
            async run(btnCtx) {
              verifyEmb.thumbnail = { url: ICONS.CROSS_MARK };
              verifyEmb.title = '**Submission Rejected!**';
              verifyEmb.color = COLORS.ERROR;
              if (!StaffCheck.isStaff(btnCtx.member!)) {
                await btnCtx.createResponse(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                  content: 'Ping a mod to get approval!',
                  flags: MessageFlags.EPHEMERAL,
                });
              } else {
                await btnCtx.editOrRespond({
                  embeds: [verifyEmb],
                });
              }
            },
          });
        await ctx.editOrRespond({
          embeds: [verifyEmb],
          components: [approveRow],
        });
        if (proofMsg.attachments.first()?.isVideo) {
          await ctx.createMessage({
            content: `${
              proofMsg.attachments.first()?.url || '*Tried to put video url, but failed*'
            }`,
            flags: MessageFlags.EPHEMERAL,
          });
        } else {
          await ctx.createMessage({
            content: `${
              extractLinks(proofMsg.content)?.at(0)
              || "*Tried to extract first url in contestant's message but failed*"
            }`,
            flags: MessageFlags.EPHEMERAL,
          });
        }
      },
    },
    {
      name: 'setup',
      description: 'Select channel where leaderboard updates will come',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel where leaderboard updates will come',
          type: ApplicationCommandOptionTypes.CHANNEL,
          required: true,
          channelTypes: [ChannelTypes.GUILD_TEXT],
        },
      ],
      onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      async run(ctx, args) {
        const setupChannel = args.channel as Channel;

        await ctx.editOrRespond({
          content: `Selected channel: ${setupChannel.mention} `,
          flags: MessageFlags.EPHEMERAL,
        });

        PMAEventHandler.emit('leaderboardChannelUpdate', setupChannel);
      },
    },
    {
      name: 'refresh',
      description: 'Refreshes leaderboard cache & optionally updates leaderboard channel',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'update_leaderboard',
          description: 'Should update leaderboard after cache refresh? (default False)',
          type: ApplicationCommandOptionTypes.BOOLEAN,
          default: false,
        },
      ],
      onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      run(ctx, args) {
        PMAEventHandler.emit('leaderboardRefresh', args.update_leaderboard);

        ctx.editOrRespond({
          content: `Refresh initiated, please wait for a while before using this command\nWill update Leaderboard? \`${args.update_leaderboard}\``,
          flags: MessageFlags.EPHEMERAL,
        });
      },
    },
    {
      name: 'view_summary',
      description: 'View individual leaderboard summary',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'element_category',
          description: 'Select category to view',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: LEADERBOARD_ELE_CATEGORY_CHOICES,
        },
      ],
      onBeforeRun(ctx) {
        return StaffCheck.isCtxStaff(ctx, true);
      },
      async run(ctx, args) {
        const emb = await showcaseLeaderboardGenerate(
          args.element_category as ElementDamageCategories,
        );

        ctx.editOrRespond({
          embed: emb,
        });
      },

      onRunError(ctx, args, error) {
        ctx.editOrRespond({
          embed: {
            title: 'An error occurred',
            color: COLORS.ERROR,
            description: `${args.element_category} embed could not be fetched`,
            fields: [
              {
                name: '**Error message**',
                value: `${error || 'Check console'}`,
              },
            ],
          },
        });
      },
    },
    {
      name: 'view',
      description: 'View individual leaderboard',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'element_category',
          description: 'Which element was used?',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: LEADERBOARD_ELE_CATEGORY_CHOICES,
        },
        {
          name: 'type_category',
          description: 'Whether this score was made solo or not',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: <{ name: string; value: GroupCategoryType }[]>[
            { name: 'Solo', value: 'solo' },
            { name: 'Open', value: 'open' },
          ],
        },
      ],
      async run(ctx, args: LeaderBoardArgs) {
        const leaderboardEmbeds = await leaderboardViewGenerate(
          args.element_category!,
          args.type_category!,
        );

        await ctx.editOrRespond({
          embed: leaderboardEmbeds[0],
          components: [viewPages(leaderboardEmbeds)],
        });
      },
    },
  ],
});
