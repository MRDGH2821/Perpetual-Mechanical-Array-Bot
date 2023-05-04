import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, type ListenerOptions } from '@sapphire/framework';
import { channelMention, hyperlink, type EmojiIdentifierResolvable } from 'discord.js';
import { sequentialPromises } from 'yaspr';
import { PMAEventHandler } from '../../baseBot/lib/Utilities';
import { ChannelIds, ThreadIds } from '../../lib/Constants';
import { userLink } from '../../lib/utils';
import LeaderboardCache from '../lib/LeaderboardCache';
import { digitEmoji, leaderboardProps } from '../lib/Utilities';
import type { DBLeaderboardData, LBRegistrationArgs } from '../typeDefs/leaderboardTypeDefs';

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: 'LBPostRegister',
  name: 'Leaderboard Registration',
})
export default class LBPostRegister extends Listener {
  public async run(args: LBRegistrationArgs, oldScoreData?: DBLeaderboardData) {
    try {
      await args.proofMessage.react('✅');

      const rank = await LeaderboardCache.getRank(args.contestant.id, args.element, args.groupType);
      const props = leaderboardProps(args.element);

      await args.proofMessage.react(props.emoji).catch(container.logger.error);
      container.logger.debug({ rank });
      if (rank >= 100 || rank < 1) {
        container.logger.warn('Rank not in top 100, exiting.');
        return;
      }
      this.sendLog(args, rank, oldScoreData);
      if (rank >= 1 && rank <= 3) {
        await args.proofMessage.react('⭐');
      }

      container.logger.debug('Will react with emoji');
      if (rank === 1) {
        await args.proofMessage.react('🥇');
        return;
      }

      if (rank === 2) {
        await args.proofMessage.react('🥈');
        return;
      }

      if (rank === 3) {
        await args.proofMessage.react('🥉');
        return;
      }
      container.logger.debug('Will react with digits');
      const digits = rank.toString().split('');
      container.logger.debug({ rank, digits });
      const digitEmojis = digits.map((digit) => digitEmoji(digit));
      container.logger.debug({ digitEmojis });

      const emojisDone = new Set<EmojiIdentifierResolvable>();
      const reactWord = async (emoji: EmojiIdentifierResolvable) => {
        if (emojisDone.has(emoji)) {
          return args.proofMessage.react('#️⃣');
        }
        container.logger.debug(`Emoji: `, emoji);
        return args.proofMessage.react(emoji.toString()).then((rt) => {
          emojisDone.add(emoji);
          return rt;
        });
      };

      await sequentialPromises(digitEmojis, reactWord).catch(container.logger.error);
      // reactWord(':thinking:');
    } catch (e) {
      container.logger.error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async sendLog(args: LBRegistrationArgs, rank: number, oldScoreData?: DBLeaderboardData) {
    const { channel } = args.proofMessage;
    container.logger.debug('Preparing to send leaderboard registration log');
    if (channel.isDMBased()) {
      throw new Error('Cannot fetch Traveler mains server channel');
    }

    if (!channel.isTextBased() || channel.isVoiceBased()) {
      throw new Error('Cannot fetch Traveler mains server text channel');
    }

    if (channel.isThread()) {
      throw new Error(
        `Proof message is supposed to be in ${channelMention(
          ChannelIds.SHOWCASE,
        )} (Showcase channel)`,
      );
    }

    const thread = await channel.threads.fetch(ThreadIds.LB_REGISTRATION_LOGS);

    if (!thread?.isThread()) {
      throw new Error(`Cannot fetch Leaderboard Registration log thread`);
    }
    await thread.join();

    const props = leaderboardProps(args.element);

    thread
      .send({
        embeds: [
          {
            title: 'A New Score was added!',
            color: props.color,
            thumbnail: {
              url: props.icon,
            },
            author: {
              name: args.contestant.tag,
              url: userLink(args.contestant),
            },
            fields: [
              {
                name: 'Contestant',
                value: `${args.contestant.tag} ${args.contestant}`,
              },
              {
                name: 'Leaderboard',
                value: props.name,
              },
              {
                name: 'Group',
                value: args.groupType,
              },
              {
                name: 'Rank',
                value: rank.toString(),
              },
              {
                name: 'New Score',
                value: hyperlink(args.score.toString(), args.proofMessage.url),
              },
              {
                name: 'Previous score (if any)',
                value: `${
                  oldScoreData
                    ? hyperlink(oldScoreData.score.toString(), oldScoreData.proof)
                    : 'This is a fresh New Entry!'
                }`,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      })
      .then(() => {
        container.logger.debug('Leaderboard Registration log sent!');
      });
  }
}
