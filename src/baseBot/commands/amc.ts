import { Subcommand } from '@sapphire/plugin-subcommands';
import EnvConfig from '../../lib/EnvConfig';
import { replyTech, travelerCmdProps } from '../lib/Utilities';

const cmdProps = travelerCmdProps('anemo');
const cmdDef = cmdProps.commandDefinition;
const { prop } = cmdProps;
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
            return interaction.reply({ content: prop.guide });
          },
        },
        {
          name: cmdDef.options![1].name,
          type: 'method',
          chatInputRun(interaction) {
            return replyTech(interaction, prop.element, 'burst');
          },
        },
        {
          name: cmdDef.options![2].name,
          type: 'method',

          chatInputRun(interaction) {
            return replyTech(interaction, prop.element, 'skill');
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
