import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';
import { ELEMENTS } from '../../botTypes/types';
import EnvConfig from '../../lib/EnvConfig';
import { hallOfFameViewGenerate } from '../../lib/hallOfFameCacheManager';
import { getAbyssQuote } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'hall-of-fame',
  description: 'Hall of Fame Commands',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'view',
      description: 'View Hall Of Fame',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'element',
          description: 'Select Element',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: <{ name: string; value: ELEMENTS }[]>[
            {
              name: 'Herrscher of Wind (Anemo)',
              value: 'anemo',
            },
            {
              name: 'Jūnzhǔ of Earth (Geo)',
              value: 'geo',
            },
            {
              name: "Ten'nō of Thunder (Electro)",
              value: 'electro',
            },
            {
              name: 'Arbitrator of Fate (Unaligned)',
              value: 'unaligned',
            },
          ],
        },
        {
          name: 'crown_quantity',
          description: 'Select Crown Quantity',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          choices: [
            { name: 'One (1)', value: 'one' },
            { name: 'Two (2)', value: 'two' },
            { name: 'Three (3)', value: 'three' },
          ],
        },
      ],
      async run(ctx, args) {
        const hallOfFameEmbeds = await hallOfFameViewGenerate(args.element, args.crown_quantity);
        const totalEmbeds = hallOfFameEmbeds.length;
        let currentIndex = 0;

        const viewRow = new ComponentActionRow()
          .addButton({
            emoji: '⬅️',
            label: 'Previous',
            customId: 'previous',
            style: MessageComponentButtonStyles.SECONDARY,
            async run(btnCtx) {
              if (currentIndex >= 0) {
                currentIndex -= 1;
                await btnCtx.editOrRespond({
                  embed: hallOfFameEmbeds[currentIndex],
                  components: [viewRow],
                });
              } else {
                await btnCtx.editOrRespond({
                  content: getAbyssQuote(),
                  components: [viewRow],
                });
              }
            },
          })
          .addButton({
            emoji: '➡️',
            label: 'Next',
            customId: 'next',
            style: MessageComponentButtonStyles.SECONDARY,
            async run(btnCtx) {
              if (currentIndex < totalEmbeds) {
                currentIndex += 1;
                await btnCtx.editOrRespond({
                  embed: hallOfFameEmbeds[currentIndex],
                  components: [viewRow],
                });
              } else {
                await btnCtx.editOrRespond({
                  content: getAbyssQuote(),
                  components: [viewRow],
                });
              }
            },
          });

        await ctx.editOrRespond({
          embed: hallOfFameEmbeds[currentIndex],
          components: [viewRow],
        });
      },
    },
  ],
  onBeforeRun(ctx) {
    if (!isHoFRefreshComplete()) {
      ctx.editOrRespond({
        content: 'Refresh is ongoing, please wait for a while before using this command',
        flags: MessageFlags.EPHEMERAL,
      });
    }
    return isHoFRefreshComplete();
  },
});
