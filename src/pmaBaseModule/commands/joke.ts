import { ApplicationCommandOptionTypes, MessageFlags } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { User } from 'detritus-client/lib/structures';
import { SimpleEmbed } from '../../botTypes/interfaces';
import { JokeCategories, OneJokeFormat } from '../../botTypes/types';
import { COLORS } from '../../lib/Constants';
import EnvConfig from '../../lib/EnvConfig';
import { getJoke } from '../../lib/Utilities';

function processJoke(joke: OneJokeFormat, user: User): SimpleEmbed {
  const jokeText = joke.type === 'single' ? joke.joke : `${joke.setup}\n\n${joke.delivery}`;

  return {
    title: `**${joke.category} Joke!**`,
    description: jokeText,
    author: {
      name: `Requested by ${user.tag}`,
      iconUrl: user.avatarUrl,
      url: user.jumpLink,
    },
    color: COLORS.EMBED_COLOR,
  };
}

export default new InteractionCommand({
  name: 'joke',
  description: 'Get a joke!',
  global: false,
  guildIds: [EnvConfig.guildId],
  options: [
    {
      name: 'category',
      description: 'Select category of joke',
      type: ApplicationCommandOptionTypes.STRING,
      default: 'Any',
      choices: <{ name: JokeCategories; value: JokeCategories }[]>[
        {
          name: 'Any',
          value: 'Any',
        },
        {
          name: 'Christmas',
          value: 'Christmas',
        },
        {
          name: 'Dark',
          value: 'Dark',
        },
        {
          name: 'Misc',
          value: 'Misc',
        },
        {
          name: 'Programming',
          value: 'Programming',
        },
        {
          name: 'Pun',
          value: 'Pun',
        },
        {
          name: 'Spooky',
          value: 'Spooky',
        },
      ],
    },
    {
      name: 'safe_mode',
      description: 'Get a safe joke',
      type: ApplicationCommandOptionTypes.BOOLEAN,
      default: true,
    },
  ],
  async run(ctx, args: { category?: JokeCategories; safe_mode?: boolean }) {
    let joke = await getJoke(args.category, true);

    if (args.category === 'Dark' && (args.safe_mode === true || ctx.channel?.nsfw === false)) {
      joke = await getJoke('Any', args.safe_mode);
    }

    if (args.safe_mode === false && ctx.channel?.nsfw === true) {
      joke = await getJoke(args.category, args.safe_mode);
    }

    await ctx.editOrRespond({
      content: `Selected type: ${args.category}\nSafe mode? ${args.safe_mode}`,
    });

    await ctx.channel?.createMessage({
      embed: processJoke(joke, ctx.user),
    });

    if ((args.safe_mode === false || args.category === 'Dark') && ctx.channel?.nsfw === false) {
      await ctx.createMessage({
        content: 'You cannot use unsafe mode or Dark jokes category in current channel',
        flags: MessageFlags.EPHEMERAL,
      });
    }
  },
});
