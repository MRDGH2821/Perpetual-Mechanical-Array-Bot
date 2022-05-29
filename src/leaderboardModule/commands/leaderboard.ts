import { CHANNEL_IDS, COLORS, ICONS } from '@pma-lib/Constants';
import EnvConfig from '@pma-lib/EnvConfig';
import { isStaff } from '@pma-lib/StaffCheck';
import {
  isLeaderboardLink,
  leafDebug,
  PMAEventHandler,
  randomSkillIcon
} from '@pma-lib/UtilityFunctions';
import { LeaderBoardArgs, LeaderboardEntryOptions, SimpleEmbed } from '@pma-types/interfaces';
import {
  ApplicationCommandOptionTypes,
  InteractionCallbackTypes,
  MessageComponentButtonStyles,
  MessageFlags
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Channel } from 'detritus-client/lib/structures';
import { ComponentActionRow } from 'detritus-client/lib/utils';

export default new InteractionCommand({
  name: 'leaderboard',
  description: 'Leaderboard commands',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  options: [
    {
      name: 'register',
      description: 'Register score',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'contestant',
          description: 'Who made the score? (You can put user ID as well)',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: 'category',
          description: 'Damage Category',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
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
          name: 'group_type',
          description: 'Type category',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            {
              name: 'Solo',
              value: 'solo',
            },
            {
              name: 'Open',
              value: 'open',
            },
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
      async run(ctx, args: LeaderBoardArgs) {
        try {
          const dmgCategory = args.category!;

          if (args.contestant?.bot === true || !isLeaderboardLink(args.proof_link!)) {
            await ctx.editOrRespond({
              embed: {
                color: COLORS.ERROR,
                title: '**ERROR!**',
                thumbnail: { url: ICONS.CROSS_MARK },
                description: `Make sure the contestant is not a bot. \nAnd the proof link is from <#${CHANNEL_IDS.SHOWCASE}>\n\n**Contestant**: ${args.contestant?.mention} ${args.contestant?.tag} \n**Category**: ${dmgCategory} \n**Group**: ${args.group_type} \n**Score (i.e. Dmg value)**: ${args.score} \n\n**Proof**: \n${args.proof_link}`,
              },
            });
          } else {
            const msgIds = args.proof_link?.match(/\d+/gm)!;
            // console.log('msg id', msgIds[msgIds.length - 1]);

            const verifyEmb: SimpleEmbed = {
              title: '**Entry Verification**',
              description: `**Contestant**: ${args.contestant?.mention} \`${args.contestant?.tag}\` \n**Category**: ${dmgCategory} \n**Group**: ${args.group_type} \n**Score (i.e. Dmg value)**: ${args.score} \n\n**Proof**: \n${args.proof_link}`,
              fields: [],
            };

            try {
              const leaderBoardChannel = ctx.guild?.channels.get(CHANNEL_IDS.SHOWCASE);

              const { author, content } = await leaderBoardChannel!.fetchMessage(
                msgIds[msgIds.length - 1],
              );

              verifyEmb.fields?.push({
                name: '**Auto verification**',
                value: `**Contestant**: ${
                  author.id === args.contestant!.id
                    ? 'Verified'
                    : `Cannot Verify (most likely submission done on behalf of ${args.contestant?.tag} by ${author.tag})`
                }\n**Score**: ${
                  content.match(`${args.score}`)?.length
                    ? 'Verified'
                    : "Cannot Verify (most likely because contestant didn't put score as text while uploading proof"
                }`,
              });
            } catch (err) {
              console.error(err);
              leafDebug(err);
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
                  if (!isStaff(btnCtx.member!)) {
                    await btnCtx.createResponse(
                      InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                      {
                        content: 'Ping a mod to get approval!',
                        flags: MessageFlags.EPHEMERAL,
                      },
                    );
                  } else {
                    await btnCtx.editOrRespond({
                      embeds: [verifyEmb],
                    });

                    const registration: LeaderboardEntryOptions = {
                      elementCategory: dmgCategory,
                      proof: args.proof_link!,
                      score: args.score!,
                      typeCategory: args.group_type!,
                      userID: args.contestant!.id!,
                    };

                    PMAEventHandler.emit('leaderboardEntry', registration);
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
                  if (!isStaff(btnCtx.member!)) {
                    await btnCtx.createResponse(
                      InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                      {
                        content: 'Ping a mod to get approval!',
                        flags: MessageFlags.EPHEMERAL,
                      },
                    );
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
          }
        } catch (err) {
          leafDebug(err);
        }
      },

      onValueError(ctx, args, errs) {
        leafDebug(errs);
      },
    },
    {
      name: 'setup',
      description: 'Setup Leaderboard channel',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'channel',
          description: 'Select channel where leaderboard updates will come',
          type: ApplicationCommandOptionTypes.CHANNEL,
          required: true,
        },
      ],
      async run(ctx, args) {
        const setupChannel = args.channel as Channel;

        await ctx.editOrRespond({
          content: `Selected channel: ${setupChannel.mention} `,
        });
      },
    },
  ],
});
