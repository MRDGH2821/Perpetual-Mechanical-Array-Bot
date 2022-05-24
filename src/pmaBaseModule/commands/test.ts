import * as Constants from '@pma-lib/Constants';
import EnvConfig from '@pma-lib/EnvConfig';
import { GiveRoleArgs, SimpleEmbed } from '@pma-types/interfaces';
import {
  ApplicationCommandOptionTypes,
  MessageComponentButtonStyles,
} from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';

export default new InteractionCommand({
  name: 'test',
  description: 'experimental command',
  global: false,
  guildIds: [EnvConfig.guildId!],
  options: [
    {
      name: 'user',
      description: 'select user to give roles',
      type: ApplicationCommandOptionTypes.USER,
      required: true,
    },
  ],
  async run(ctx, args: GiveRoleArgs) {
    const { user: target } = args;
    const firstPage: SimpleEmbed = {
      title: '**Select Roles**',
      description: `Select Roles to give to <@${target?.id}>. The amount of EXP will be calculated in end.`,
      color: Constants.COLORS.EMBED_COLOR,
    };
    const lastPage: SimpleEmbed = {
      title: '**Roles successfully rewarded!**',
      description: `The following roles have been assigned to <@${args.user?.id}>:\n\n`,
      color: Constants.COLORS.EMBED_COLOR,
    };
    const options = [
      {
        description: 'Completed Spiral Abyss 36/36 & all Spiral abyss achievements',
        emoji: '🌀',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.ABYSSAL_CONQUEROR)?.name,
        value: Constants.ROLE_IDS.ABYSSAL_CONQUEROR,
      },
      {
        default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.MONDSTADT),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '🕊️',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.REPUTATION.MONDSTADT)?.name,
        value: Constants.ROLE_IDS.REPUTATION.MONDSTADT,
      },
      {
        default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.LIYUE),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '⚖️',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.REPUTATION.LIYUE)?.name,
        value: Constants.ROLE_IDS.REPUTATION.LIYUE,
      },
      {
        default: target?.roles.has(Constants.ROLE_IDS.REPUTATION.INAZUMA),
        description: '100% Map + Subregions + Achievements + Max Reputation',
        emoji: '⛩️',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.REPUTATION.INAZUMA)?.name,
        value: Constants.ROLE_IDS.REPUTATION.INAZUMA,
      },
      {
        description: 'Crowned their Anemo Traveler',
        emoji: '🌪️',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.ANEMO)?.name,
        value: Constants.ROLE_IDS.CROWN.ANEMO,
      },
      {
        description: 'Crowned their Geo Traveler',
        emoji: '🪨',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.GEO)?.name,
        value: Constants.ROLE_IDS.CROWN.GEO,
      },
      {
        description: 'Crowned their Electro Traveler',
        emoji: '⚡',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.ELECTRO)?.name,
        value: Constants.ROLE_IDS.CROWN.ELECTRO,
      },
      {
        default: target?.roles.has(Constants.ROLE_IDS.CROWN.UNALIGNED),
        description: 'Crowned their Unaligned Traveler',
        emoji: '👑',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.CROWN.UNALIGNED)?.name,
        value: Constants.ROLE_IDS.CROWN.UNALIGNED,
      },
      {
        default: target?.roles.has(Constants.ROLE_IDS.WHALE),
        description: 'Spent $1500, or have c6 5* chars or r5 5* weapons',
        emoji: '💰',
        label: ctx.guild?.roles.get(Constants.ROLE_IDS.WHALE)?.name,
        value: Constants.ROLE_IDS.WHALE,
      },
    ].filter((option) => {
      if (Object.values(Constants.ROLE_IDS.CROWN).includes(option.value)) {
        if (option.value === Constants.ROLE_IDS.CROWN.UNALIGNED && option.default === true) {
          return false;
        }
        return true;
      }
      if (option.value === Constants.ROLE_IDS.ABYSSAL_CONQUEROR) {
        return true;
      }
      return !target?.roles.has(option.value);
    });

    const rolesSelectMenu = new ComponentActionRow().addSelectMenu({
      customId: 'role_select_menu',
      minValues: 1,
      options,
      maxValues: options.length,
      async run(menuCtx) {
        const selectedRoles = menuCtx.data.values!;
        const selectedEmb: SimpleEmbed = {
          title: '**Selected roles**',
          description: 'Selected roles: ',
        };

        selectedRoles.forEach((roleId) => {
          selectedEmb.description = `${selectedEmb.description}\n <@&${roleId}>`;
        });

        const acceptDeclineRow = new ComponentActionRow()
          .addButton({
            label: 'Accept',
            style: MessageComponentButtonStyles.SUCCESS,
            async run(acceptBtnCtx) {
              await acceptBtnCtx.editOrRespond({
                embeds: [lastPage, selectedEmb],
              });
            },
          })
          .addButton({
            label: 'Decline & Re-select',
            style: MessageComponentButtonStyles.DANGER,
            async run(declineBtnCtx) {
              declineBtnCtx.editOrRespond({
                embeds: [firstPage],
                components: [rolesSelectMenu],
              });
            },
          });

        await menuCtx.editOrRespond({
          embeds: [selectedEmb],
          components: [acceptDeclineRow],
        });
      },
    });

    await ctx.editOrRespond({
      embed: firstPage,
      components: [rolesSelectMenu],
    });
  },
});
