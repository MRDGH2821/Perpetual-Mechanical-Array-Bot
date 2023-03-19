import { Subcommand, SubcommandMapping } from '@sapphire/plugin-subcommands';
import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';
import type { DamageType, ELEMENTS, JSONCmd } from '../../typeDefs/typeDefs';
import { findElementProp, findTech } from '../lib/TravelerTechnologies';

function APIsubCommandBuilder(element: ELEMENTS): ApplicationCommandOptionData {
  const eleProp = findElementProp(element);

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
  const eleProp = findElementProp(element);
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
export default class UserCommand extends Subcommand {
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
  public runCmd(interaction: ChatInputCommandInteraction) {
    const element = interaction.options.getSubcommandGroup(true);
    const subCommand = interaction.options.getSubcommand(true);
    const eleProp = findElementProp(element as ELEMENTS);
    if (subCommand === 'guide') {
      return interaction.reply({ content: eleProp.guide });
    }
    const techId = interaction.options.getString('tech');
    const tech = findTech({
      element: element as ELEMENTS,
      type: subCommand as DamageType,
      id: techId!,
    });
    if (tech) {
      const { gif } = tech;
      return interaction.reply({
        content: gif,
      });
    }

    return interaction.reply({
      content: `Invalid tech name entered. (Got ${techId})`,
      flags: MessageFlags.Ephemeral,
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
