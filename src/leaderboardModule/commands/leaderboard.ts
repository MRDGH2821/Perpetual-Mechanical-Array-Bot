import { ComponentActionRow } from 'detritus-client/lib/utils';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import {
  ApplicationCommandOptionTypes,
  ChannelTypes,
  InteractionCallbackTypes,
  MessageComponentButtonStyles,
  MessageFlags,
} from 'detritus-client/lib/constants';
import { Channel } from 'detritus-client/lib/structures';
import EnvConfig from '../../lib/EnvConfig';
import db from '../../lib/Firestore';
import { COLORS, ChannelIds, ICONS } from '../../lib/Constants';
import {
  Debugging, StaffCheck, randomSkillIcon, PMAEventHandler,
} from '../../lib/Utilities';
import { ElementDamageCategories, LeaderboardDBOptions } from '../../botTypes/types';
import { LeaderBoardArgs, SimpleEmbed } from '../../botTypes/interfaces';
import { showcaseLeaderboardGenerate } from '../../lib/leaderboardCacheManager';

export default new InteractionCommand({
  name: 'leaderboard',
  description: 'Leaderboard commands',
  global: false,
  guildIds: [EnvConfig.guildId!],
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
          choices: <{ name: string; value: ElementDamageCategories }[]>[
            {
              name: 'Anemo: Palm Vortex',
              value: 'anemo-dmg-skill',
            },
            {
              name: 'Geo: Starfell Sword',
              value: 'geo-dmg-skill',
            },
            {
              name: 'Electro: Lightening Blade',
              value: 'electro-dmg-skill',
            },
            {
              name: 'Universal: 5th normal Atk dmg',
              value: 'uni-dmg-n5',
            },
          ],
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
        const verifyEmb: SimpleEmbed = {
          title: '**Entry Verification**',
          description: `**Contestant**: ${args.contestant?.mention} \`${args.contestant?.tag}\` \n**Category**: ${dmgCategory} \n**Group**: ${args.type_category} \n**Score (i.e. Dmg value)**: ${args.score} \n\n**Proof**: \n${args.proof_link}`,
          fields: [],
        };

        try {
          const leaderBoardChannel = ctx.guild?.channels.get(ChannelIds.SHOWCASE);

          const { author, content } = await leaderBoardChannel!.fetchMessage(
            msgIds[msgIds.length - 1],
          );

          verifyEmb.fields?.push({
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
          });
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
              } else {
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
              }
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
        if (!StaffCheck.isStaff(ctx.member!)) {
          ctx.editOrRespond({
            content: 'Only mods can change leaderboard channel',
            flags: MessageFlags.EPHEMERAL,
          });
        }
        return StaffCheck.isStaff(ctx.member!);
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
      description: 'Refreshes leaderboard cache',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      run(ctx) {
        if (!process.env.LEADERBOARD || process.env.LEADERBOARD === 'false') {
          ctx.editOrRespond({
            content: 'Refresh initiated, please wait for a while before updating leaderboard',
            flags: MessageFlags.EPHEMERAL,
          });
        } else {
          ctx.editOrRespond({
            content: 'Refresh is ongoing, please wait for a while before updating leaderboard',
            flags: MessageFlags.EPHEMERAL,
          });
        }
      },
    },
    {
      name: 'view_mini',
      description: 'View individual leaderboard embed',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'element_category',
          description: 'Select category to view',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: <{ name: string; value: ElementDamageCategories }[]>[
            {
              name: 'Anemo: Palm Vortex',
              value: 'anemo-dmg-skill',
            },
            {
              name: 'Geo: Starfell Sword',
              value: 'geo-dmg-skill',
            },
            {
              name: 'Electro: Lightening Blade',
              value: 'electro-dmg-skill',
            },
            {
              name: 'Universal: 5th normal Atk dmg',
              value: 'uni-dmg-n5',
            },
          ],
        },
      ],
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
  ],
});
