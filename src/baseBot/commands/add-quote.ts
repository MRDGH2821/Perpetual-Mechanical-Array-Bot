import { ApplyOptions } from '@sapphire/decorators';
import { Command,container } from '@sapphire/framework';
import { ApplicationCommandOptionType,PermissionFlagsBits } from 'discord.js';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import type { DBQuotes } from '../../typeDefs/typeDefs';
import QuotesManager from '../lib/QuotesManager';
import { PMAEventHandler } from '../lib/Utilities';

@ApplyOptions<Command.Options>({
  name: 'add-quote',
  description: 'Adds a quote/gif/reason among various things in bot',
})
export default class GuildCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        dm_permission: false,
        dmPermission: false,
        defaultMemberPermissions: [PermissionFlagsBits.ManageMessages],
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: 'quote_gif_reason',
            description:
              'Enter a quote/gif/reason. You can also tag people or add emojis from current server',
            required: true,
          },
          {
            type: ApplicationCommandOptionType.String,
            name: 'type',
            description:
              'Enter a quote/gif/reason. You can also tag people or add emojis from current server',
            required: true,
            choices: <{ name: string; value: DBQuotes }[]>[
              {
                name: 'FBI Quotes',
                value: 'FBIQuotes',
              },
              {
                name: 'FBI Gifs',
                value: 'FBIGifs',
              },
              {
                name: 'RNG Mute Quotes',
                value: 'RNGMuteQuotes',
              },
              {
                name: 'RNG Mute Reasons',
                value: 'RNGMuteReasons',
              },
              {
                name: 'TikTok Gifs',
                value: 'TikTokGifs',
              },
              {
                name: 'TikTok Quotes',
                value: 'TikTokQuotes',
              },
              {
                name: 'Abyss Gifs',
                value: 'abyssGifs',
              },
              {
                name: 'Abyss Quotes',
                value: 'abyssQuotes',
              },
              {
                name: 'Ban Hammer Reasons',
                value: 'banHammerReasons',
              },
              {
                name: 'Bonk Gifs',
                value: 'bonkGifs',
              },
              {
                name: 'Crowd Sourced Bonk Reasons',
                value: 'crowdSourcedBonkReasons',
              },
              {
                name: 'Crowd Sourced Horny Bonk Reasons',
                value: 'crowdSourcedHornyBonkReasons',
              },
              {
                name: 'Horny Bonk Gifs',
                value: 'hornyBonkGifs',
              },
              {
                name: 'Leak Quotes',
                value: 'leakQuotes',
              },
              {
                name: 'Leak Mute Reasons',
                value: 'leaksMuteReasons',
              },
              {
                name: 'Self Horny Bonk Gifs',
                value: 'selfHornyBonkGifs',
              },
              {
                name: 'Yoyoverse Quotes',
                value: 'yoyoverseQuotes',
              },
            ],
          },
        ],
      },
      {
        guildIds: [EnvConfig.guildId],
      },
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const quote = interaction.options.getString('quote_gif_reason', true);
    const quoteType = interaction.options.getString('type', true) as DBQuotes;
    QuotesManager.add(quoteType, quote)
      .then(() => {
        interaction.reply({
          embeds: [
            {
              title: 'Quote/GIF/Reason Added!',
              color: COLORS.EMBED_COLOR,
              description: `Your quote/gif/reason: \n\n\`${quote}\`\n\nIt is added into ${quoteType}`,
            },
          ],
        });
        PMAEventHandler.emit('RefreshQuotes');
      })
      .catch((err) => {
        container.logger.error(err);
        interaction.reply({
          embeds: [
            {
              title: 'Failed to add',
              color: COLORS.ERROR,
              description: `Your quote/gif/reason: \n\n\`${quote}\`\n\nCould not be added into ${quoteType}`,
            },
          ],

          files: [
            {
              attachment: JSON.stringify(err, null, 2),
              name: 'Error log.txt',
              description: 'Error logs while adding quote',
            },
          ],
        });
      });
  }
}
