import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType } from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';
import { HALL_OF_FAME_ELEMENT_CHOICES } from '../lib/Constants';

const cmdDef: JSONCmd = {
  name: 'hall-of-fame',
  description: 'Hall of Fame commands',
  options: [
    {
      type: 1,
      name: 'refresh',
      description: 'Refreshes Hall of Fame cache',
    },
    {
      type: 1,
      name: 'ranks',
      description: 'Show Hall of Fame rankings',
      options: [
        {
          name: 'element',
          description: 'Select Element',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: HALL_OF_FAME_ELEMENT_CHOICES,
        },
        {
          name: 'crown_quantity',
          description: 'Select Crown Quantity',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'One (1)', value: 'one' },
            { name: 'Two (2)', value: 'two' },
            { name: 'Three (3)', value: 'three' },
          ],
        },
      ],
    },
    {
      type: 1,
      name: 'publish',
      description: 'Publishes the names of crown role holders',
    },
  ],
};
export default class UserCommand extends Subcommand {
  public constructor(context: Subcommand.Context, options: Subcommand.Options) {
    super(context, {
      ...options,
      name: cmdDef.name,
      description: cmdDef.description,

      subcommands: [
        {
          name: cmdDef.options![0].name,
          type: 'method',
          
          chatInputRun(interaction) {
            return interaction.reply({ content: 'Hello this is cmd1!' });
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun(interaction) {
            return interaction.reply({ content: 'Hello this is cmd2!' });
          },
        },
        {
          name: cmdDef.options![2].name,
          type: 'method',
          chatInputRun(interaction) {
            return interaction.reply({ content: 'Hello this is cmd3!' });
          },
        },
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
