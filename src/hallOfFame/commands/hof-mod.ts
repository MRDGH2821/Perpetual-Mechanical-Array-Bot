import { Subcommand } from '@sapphire/plugin-subcommands';
import EnvConfig from '../../lib/EnvConfig';
import type { JSONCmd } from '../../typeDefs/typeDefs';

const cmdDef: JSONCmd = {
  name: 'hof-mod',
  description: 'Hall of Fame mod only commands',
  options: [
    {
      type: 1,
      name: 'refresh',
      description: 'Refreshes Hall of Fame cache',
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
      preconditions: ['ModOnly'],
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
      ],
    });
  }

  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(cmdDef, {
      guildIds: [EnvConfig.guildId],
    });
  }
}
