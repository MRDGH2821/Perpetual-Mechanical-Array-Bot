import { EMOJIS, ROLE_IDS } from '@pma-lib/Constants';
import EnvConfig from '@pma-lib/EnvConfig';
import { canGibRole } from '@pma-lib/StaffCheck';
import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { Member } from 'detritus-client/lib/structures';

export default new InteractionCommand({
  name: 'give-role',
  global: false,
  guildIds: [EnvConfig.guildId as string],
  options: [
    {
      name: 'one',
      description: 'Give one role!',
      type: ApplicationCommandOptionTypes.SUB_COMMAND,
      options: [
        {
          name: 'user',
          description: 'Select user',
          type: ApplicationCommandOptionTypes.USER,
          required: true,
        },
        {
          name: 'role',
          description: 'Select Role',
          type: ApplicationCommandOptionTypes.STRING,
          required: true,
          async onAutoComplete(ctx) {
            const repRoles = [
              {
                name: 'Megastar in Mondstadt 🚶🌬️',
                value: ROLE_IDS.REPUTATION.MONDSTADT,
              },
              {
                name: 'Illustrious in Inazuma 🚶⛈️',
                value: ROLE_IDS.REPUTATION.INAZUMA,
              },
              {
                name: 'Legend in Liyue 🚶🌏',
                value: ROLE_IDS.REPUTATION.LIYUE,
              },
            ];

            const crownRoles = [
              {
                name: "Ten'nō of Thunder 👑⛈️",
                value: ROLE_IDS.CROWN.ELECTRO,
              },
              {
                name: 'Jūnzhǔ of Earth 👑🌏',
                value: ROLE_IDS.CROWN.GEO,
              },
              {
                name: 'Herrscher of Wind 👑🌬️',
                value: ROLE_IDS.CROWN.ANEMO,
              },
              {
                name: 'Arbitrator of Fate 👑',
                value: ROLE_IDS.CROWN.NON_ELE,
              },
            ];

            const otherRoles = [
              {
                name: 'Affluent Adventurer 💰',
                value: ROLE_IDS.WHALE,
              },
              {
                name: 'Abyssal Conqueror 🌀',
                value: ROLE_IDS.ABYSSAL_CONQUEROR,
              },
            ];

            const allRoles = repRoles.concat(otherRoles, crownRoles);

            const inputVal = ctx.value.toLowerCase();

            const values = allRoles.filter((role) => role.name.toLowerCase().includes(inputVal));

            const choices = values.map((role) => ({
              name: role.name,
              value: role.value,
            }));

            ctx.respond({ choices });
          },
        },
      ],

      async onBefore(ctx) {
        const canGib = canGibRole(ctx.member as Member);

        if (!canGib) {
          await ctx.editOrRespond({
            content: `You cannot give roles to anyone, not even to yourself ${EMOJIS.PepeKekPoint}`,
          });
        }
      },

      async run(ctx) {
        const exp = 250;
      },
    },
  ],
});
