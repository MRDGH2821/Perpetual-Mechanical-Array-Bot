import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
import EnvConfig from '../../lib/EnvConfig';

@ApplyOptions<Command.Options>({
  name: 'confess',
  description: 'Wanna confess something?',
})
export default class GuildCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        dm_permission: false,
        dmPermission: false,
        type: ApplicationCommandType.ChatInput,
        options: [
          {
            name: 'confession',
            description: 'Enter your confession!',
            required: true,
            type: ApplicationCommandOptionType.String,
          },
          {
            name: 'anonymous',
            description: 'Post as Anonymous? (default: False)',
            type: ApplicationCommandOptionType.Boolean,
          },
          {
            name: 'ping_archons',
            description: 'Notify Archons? (default: False)',
            type: ApplicationCommandOptionType.Boolean,
          },
          {
            name: 'image_upload',
            description: 'Upload an Image',
            type: ApplicationCommandOptionType.Attachment,
          },
          {
            name: 'image_link',
            description: 'Input image link',
            type: ApplicationCommandOptionType.String,
          },
          {
            name: 'skip_multiline',
            description: 'Skip parsing multiline (default: False)',
            type: ApplicationCommandOptionType.Boolean,
          },
        ],
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return interaction.reply({ content: 'Hello world!' });
  }
}
