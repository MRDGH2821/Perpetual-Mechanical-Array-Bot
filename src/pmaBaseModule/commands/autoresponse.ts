import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import EnvConfig from '../../lib/EnvConfig';
import { StaffCheck } from '../../lib/Utilities';

const autoResponseChoices = [
  {
    name: 'TikTok',
    value: 'TIKTOK',
  },
  {
    name: 'Leaks',
    value: 'LEAKS',
  },
  {
    name: 'Fbi',
    value: 'FBI',
  },
  {
    name: 'Yoyoverse',
    value: 'YOYOVERSE',
  },
];

export default new InteractionCommand({
  name: 'autoresponse',
  description: 'Auto response stuff',
  global: false,
  guildIds: [EnvConfig.guildId],
  onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  options: [
    {
      name: 'disable',
      description: 'Disable auto response',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'autoresponse',
          description: 'Select which auto response to disable',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: autoResponseChoices,
        },
      ],
      run(ctx, args) {
        process.env[`AUTORESPONSE_${args.autoresponse}`] = 'false';

        ctx.editOrRespond({
          content: `\`${args.autoresponse}\` is now disabled. It will be auto enabled after 24 hours from now.\n\nDo note that if the bot restarts, it will be enabled again.`,
          flags: MessageFlags.EPHEMERAL,
        });
        setTimeout(() => {
          process.env[`AUTORESPONSE_${args.autoresponse}`] = 'true';
        }, 1000 * 60 * 60 * 24);
      },
    },
    {
      name: 'enable',
      description: 'Enable auto response',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'autoresponse',
          description: 'Select which auto response to enable',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: autoResponseChoices,
        },
      ],
      run(ctx, args) {
        process.env[`AUTORESPONSE_${args.autoresponse}`] = 'true';

        ctx.editOrRespond({
          content: `\`${args.autoresponse}\` is now enabled.`,
          flags: MessageFlags.EPHEMERAL,
        });
      },
    },
  ],
});
