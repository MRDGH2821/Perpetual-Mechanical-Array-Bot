import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention } from 'discord.js';
import { COLORS } from '../lib/Constants';

const pkg = require('../../package.json');

const deps = Object.entries(pkg.dependencies)
  .map(([depName, depVer]) => `${depName}: ${depVer}`)
  .join('\n');

@ApplyOptions<Command.Options>({
  name: 'about',
  description: 'About the bot',
})
export default class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return interaction.reply({
      embeds: [
        {
          title: '**About the bot**',
          color: COLORS.EMBED_COLOR,
          description: `Version ${pkg.version}\nModified by: ${
            interaction.client.application.owner
          }\nCreated by: ${userMention('867811595266424852')}\n\nThe bot uses:\n${deps}`,
        },
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder({
            label: 'Source Code',
            style: ButtonStyle.Link,
            url: pkg.homepage,
          }),
        ),
      ],
    });
  }
}
