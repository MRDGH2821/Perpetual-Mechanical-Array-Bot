import { container } from '@sapphire/pieces';
import { Subcommand, type SubcommandMapping } from '@sapphire/plugin-subcommands';
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  MessageFlags,
  type ApplicationCommandOptionData,
} from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';
import type { ELEMENTS, JSONCmd } from '../../typeDefs/typeDefs';
import { getElementProp, getTech, isSkill } from '../lib/TravelerTechnologies';

function APIsubCommandBuilder(element: ELEMENTS): ApplicationCommandOptionData {
  const eleProp = getElementProp(element);

  return {
    type: ApplicationCommandOptionType.SubcommandGroup,
    name: eleProp.element,
    description: eleProp.description,
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: eleProp.skill.name,
        description: eleProp.skill.description,
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'tech',
            description: 'Select Tech',
            required: true,
            autocomplete: true,
          },
        ],
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: eleProp.burst.name,
        description: eleProp.burst.description,
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'tech',
            description: 'Select Tech',
            required: true,
            autocomplete: true,
          },
        ],
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: 'guide',
        description: `${eleProp.name} guide`,
      },
    ],
  };
}

const cmdDef: JSONCmd = {
  name: 'traveler',
  description: 'Guild command with sub commands',
  options: [
    APIsubCommandBuilder('anemo'),
    APIsubCommandBuilder('geo'),
    APIsubCommandBuilder('electro'),
    APIsubCommandBuilder('dendro'),
  ],
};

function subCommandGroupMaker(element: ELEMENTS): SubcommandMapping {
  const eleProp = getElementProp(element);
  return {
    name: eleProp.element,
    type: 'group',
    entries: [
      {
        name: 'guide',
        type: 'method',
        chatInputRun: 'runCmd',
      },
      {
        name: eleProp.skill.name,
        type: 'method',
        chatInputRun: 'runCmd',
      },
      {
        name: eleProp.burst.name,
        type: 'method',
        chatInputRun: 'runCmd',
      },
    ],
  };
}
export default class GuildCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,
      subcommands: [
        subCommandGroupMaker('anemo'),
        subCommandGroupMaker('geo'),
        subCommandGroupMaker('electro'),
        subCommandGroupMaker('dendro'),
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async runCmd(interaction: ChatInputCommandInteraction) {
    const element = interaction.options.getSubcommandGroup(true);
    const subCommand = interaction.options.getSubcommand(true);
    const eleProp = getElementProp(element as ELEMENTS);
    if (subCommand === 'guide') {
      return interaction.reply({ content: eleProp.guide });
    }
    container.logger.debug('Obtaining tech input');
    const techId = interaction.options.getString('tech', true);

    container.logger.debug('Searching for tech');
    const tech = getTech({
      element: element as ELEMENTS,
      type: isSkill(subCommand) ? 'skill' : 'burst',
      id: techId,
    });
    container.logger.debug(tech);

    if (tech) {
      const { gif } = tech;
      return interaction.reply({
        content: gif,
      });
    }

    return interaction.reply({
      content: `Invalid tech name entered. (Got \`${techId}\`)`,
      flags: MessageFlags.Ephemeral,
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
