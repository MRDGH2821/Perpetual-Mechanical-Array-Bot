import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { User, userMention } from 'discord.js';
import { COLORS } from '../../lib/Constants';

const pkg = require('../../../package.json');

const deps = Object.entries(pkg.dependencies)
  .map(([depName, depVer]) => `\`${depName}\`: ${depVer}`)
  .join('\n');

@ApplyOptions<Command.Options>({
  name: 'about',
  description: 'About the bot',
})
export default class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const owner: User | undefined =
      interaction.client.application.owner instanceof User
        ? interaction.client.application.owner
        : interaction.client.application.owner?.owner?.user;
    return interaction.reply({
      embeds: [
        {
          title: '**About the bot**',
          color: COLORS.EMBED_COLOR,
          description: `Version ${pkg.version}\nModified by: ${
            owner || '*cannot be determined*'
          }\nCreated by: ${userMention('867811595266424852')}\n\nThe bot uses:\n${deps}`,
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'Source Code',
              style: ButtonStyle.Link,
              url: pkg.homepage,
            },
          ],
        },
      ],
    });
  }
}
