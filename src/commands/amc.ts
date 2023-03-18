import { Subcommand } from '@sapphire/plugin-subcommands';
import EnvConfig from '../lib/EnvConfig';
import { AMC_PROPS } from '../lib/TravelerTechnologies';
import type { JSONCmd } from '../typeDefs/typeDefs';

const cmdDef: JSONCmd = {
  name: 'amc',
  description: AMC_PROPS.name,
  options: [
    {
      type: 1,
      name: 'guide',
      description: 'Anemo Traveler Guide on Keqing Mains',
    },
    {
      type: 1,
      name: AMC_PROPS.burst.name,
      description: 'AMC Burst techs',
      options: [
        {
          type: 3,
          name: 'tech',
          description: 'Select tech',
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: AMC_PROPS.skill.name,
      description: 'AMC Skill techs',
      options: [
        {
          type: 3,
          name: 'tech',
          description: 'Select tech',
          required: true,
        },
      ],
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
            return interaction.reply({ content: AMC_PROPS.guide });
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
