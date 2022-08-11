import { ApplicationCommandOptionTypes } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { DBQuotes } from '../../botTypes/types';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { addQuote } from '../../lib/QuotesManager';
import { StaffCheck } from '../../lib/Utilities';

export default new InteractionCommand({
  name: 'add-quote',
  description: 'Adds a quote/gif/reason among various things in bot',
  guildIds: [EnvConfig.guildId],
  global: false,
  options: [
    {
      name: 'quote_gif_reason',
      description:
        'Enter a quote/gif/reason. ou can also tag people or add emojis from current server',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
    },
    {
      name: 'type',
      description: 'Where to add this?',
      type: ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: <{ name: string; value: DBQuotes }[]>[
        {
          name: 'FBI Gifs',
          value: 'FBIGifs',
        },
        {
          name: 'FBI Quotes',
          value: 'FBIQuotes',
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
          name: '(Anti) TikTok Gifs',
          value: 'TikTokGifs',
        },
        {
          name: '(Anti) TikTok Quotes',
          value: 'TikTokQuotes',
        },
        {
          name: 'Abyss Gifs (appearing in leaderboard commands)',
          value: 'abyssGifs',
        },
        {
          name: 'Abyss Quotes (appearing in leaderboard commands)',
          value: 'abyssQuotes',
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
          name: 'Leaks Mute Reasons',
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
        {
          name: 'Ban Hammer Reasons',
          value: 'banHammerReasons',
        },
      ],
    },
    {
      name: 'trigger_refresh',
      description: 'Whether to refresh all the quotes or not (default true)',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: true,
    },
  ],
  onBeforeRun(ctx) {
    return StaffCheck.isCtxStaff(ctx, true);
  },
  async run(ctx, args: { quote_gif_reason?: string; type?: DBQuotes; trigger_refresh?: boolean }) {
    await addQuote(args.type!, args.quote_gif_reason!, args.trigger_refresh);

    const embed: SimpleEmbed = {
      color: COLORS.EMBED_COLOR,
      title: '**Quote/Gif/Reason added!**',
      description: `Your quote/gif/reason was successfully added\n\nYour input: ${args.quote_gif_reason}\n\nInput for: ${args.type}\n\nWill trigger refresh: ${args.trigger_refresh}`,
    };

    await ctx.editOrRespond({
      embed,
    });
  },
});
