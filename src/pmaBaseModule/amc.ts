import { InteractionCallbackTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';

export default new InteractionCommand({
  name: 'amc',
  description: 'Anemo Main Character',
  global: false,
  guildIds: [process.env.GUILD_ID as string],
  options: [
    {
      name: 'palm_vortex',
      description: 'AMC Skill',
      isSubCommand: true,
      choices: [
        {
          name: 'techs',
        },
      ],

      async run(ctx, args) {
        ctx.respond(InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, 'test');
      },
    },
  ],
});
