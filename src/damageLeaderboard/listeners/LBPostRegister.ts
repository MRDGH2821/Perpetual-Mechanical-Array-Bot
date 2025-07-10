import { ApplyOptions } from "@sapphire/decorators";
import { Listener, type ListenerOptions } from "@sapphire/framework";
import {
  ButtonStyle,
  channelMention,
  ComponentType,
  type EmojiIdentifierResolvable,
  hyperlink,
} from "discord.js";
import { sequentialPromises } from "yaspr";
import { PMAEventHandler } from "../../baseBot/lib/Utilities.js";
import { ChannelIds, ThreadIds } from "../../lib/Constants.js";
import LeaderboardCache from "../lib/LeaderboardCache.js";
import { digitEmoji, leaderboardProps } from "../lib/Utilities.js";
import type {
  DBLeaderboardData,
  LBRegistrationArgs,
} from "../typeDefs/leaderboardTypeDefs.js";

@ApplyOptions<ListenerOptions>({
  emitter: PMAEventHandler,
  enabled: true,
  event: "LBPostRegister",
  name: "Leaderboard Registration",
})
export default class LBPostRegister extends Listener {
  public async run(args: LBRegistrationArgs, oldScoreData?: DBLeaderboardData) {
    try {
      await args.proofMessage.react("✅");

      const rank = await LeaderboardCache.getRank(
        args.contestant.id,
        args.element,
        args.groupType,
      );
      const props = leaderboardProps(args.element);

      await args.proofMessage
        .react(props.emoji)
        .catch(this.container.logger.error);
      this.container.logger.debug({ rank });
      if (rank >= 100 || rank < 1) {
        this.container.logger.warn("Rank not in top 100, exiting.");
        return;
      }

      this.sendLog(args, rank, oldScoreData);
      if (rank >= 1 && rank <= 3) {
        await args.proofMessage.react("⭐");
      }

      this.container.logger.debug("Will react with emoji");
      if (rank === 1) {
        await args.proofMessage.react("🥇");
        return;
      }

      if (rank === 2) {
        await args.proofMessage.react("🥈");
        return;
      }

      if (rank === 3) {
        await args.proofMessage.react("🥉");
        return;
      }

      this.container.logger.debug("Will react with digits");
      const digits = rank.toString().split("");
      this.container.logger.debug({ rank, digits });
      const digitEmojis = digits.map((digit) => digitEmoji(digit));
      this.container.logger.debug({ digitEmojis });

      const emojisDone = new Set<EmojiIdentifierResolvable>();
      const reactWord = async (emoji: EmojiIdentifierResolvable) => {
        if (emojisDone.has(emoji)) {
          return args.proofMessage.react("#️⃣");
        }

        this.container.logger.debug("Emoji: ", emoji);
        return args.proofMessage.react(emoji.toString()).then((rt) => {
          emojisDone.add(emoji);
          return rt;
        });
      };

      await sequentialPromises(digitEmojis, reactWord).catch(
        this.container.logger.error,
      );
      // reactWord(':thinking:');
    } catch (error) {
      this.container.logger.error(error);
    }
  }

  public async sendLog(
    args: LBRegistrationArgs,
    rank: number,
    oldScoreData?: DBLeaderboardData,
  ) {
    const { channel } = args.proofMessage;
    this.container.logger.debug(
      "Preparing to send leaderboard registration log",
    );
    if (channel.isDMBased()) {
      throw new Error("Cannot fetch Traveler mains server channel");
    }

    if (!channel.isTextBased() || channel.isVoiceBased()) {
      throw new Error("Cannot fetch Traveler mains server text channel");
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
      throw new Error("Cannot fetch Leaderboard Registration log thread");
    }

    await thread.join(",");

    const props = leaderboardProps(args.element);
    const embedLog = {
      title: "A New Score was added!",
      color: props.color,
      thumbnail: {
        url: props.icon,
      },
      fields: [
        {
          name: "Contestant",
          value: `\`${args.contestant.tag}\` ${args.contestant}`,
        },
        {
          name: "Leaderboard",
          value: props.name,
        },
        {
          name: "Group",
          value: args.groupType,
        },
        {
          name: "Rank",
          value: rank.toString(),
        },
        {
          name: "New Score",
          value: hyperlink(args.score.toString(), args.proofMessage.url),
        },
      ],
      timestamp: new Date().toISOString(),
    };

    if (oldScoreData) {
      const diff = Number(args.score) - Number(oldScoreData.score);

      const diffSign = diff < 0 ? "-" : "+";

      embedLog.fields?.push({
        name: "**Previous Score**",
        value: `[${oldScoreData.score}](${oldScoreData.proof}) \nA difference of ${diffSign} ${diff}`,
      });
    }

    thread
      .send({
        embeds: [embedLog],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: "Jump to New Score proof",
                style: ButtonStyle.Link,
                url: args.proofMessage.url,
              },
              {
                type: ComponentType.Button,
                label: "Jump to Old Score proof (if any, else new)",
                style: ButtonStyle.Link,
                url: oldScoreData?.proof || args.proofMessage.url,
              },
            ],
          },
        ],
      })
      .then(() =>
        this.container.logger.debug("Leaderboard Registration log sent!"),
      )
      .catch((error) =>
        this.container.logger.error(
          "Error sending leaderboard registration log:",
          error,
        ),
      );
  }
}
