import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, type ListenerOptions } from "@sapphire/framework";
import { pickRandom } from "@sapphire/utilities";
import type { EmojiIdentifierResolvable, Message } from "discord.js";
import { EMOJIS } from "../../lib/Constants.js";
import BonkUtilities from "../lib/BonkUtilities.js";

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
  name: "MessageReactions",
  enabled: true,
})
export default class MessageReactions extends Listener<
  typeof Events.MessageCreate
> {
  static emojisWithCondition: {
    condition(content: string): boolean;
    emojis: string[];
  }[] = [
    {
      condition: (content: string) =>
        /\b(c+o+o+k+i+e+s*)\b|🍪|🥠/gimu.test(content),
      emojis: ["🍪", "🥠"],
    },
    {
      condition: (content: string) =>
        /\b(r+i+c+e{1,})\b|🍚|🌾|🍘|🍙|🍛/gimu.test(content),
      emojis: ["🍚", "🌾", "🍘", "🍙", "🍛"],
    },
    {
      condition: (content: string) =>
        /\b(s+u+s+h+i{1,})\b|🍣|🍥/gimu.test(content),
      emojis: ["🍣", "🍥"],
    },
    {
      condition: (content: string) =>
        /\b(b+r+e+a+d+s*)\b|🍞|🥖|🥪|🥐/gimu.test(content),
      emojis: ["🍞", "🥖", "🥪", "🥐"],
    },
    {
      condition: (content: string) =>
        /\b(q+u+a+c+k{1,}\b|\b(h+o+n+k{1,})\b)|🦆/gimu.test(content),
      emojis: [
        EMOJIS.BoreasKek,
        EMOJIS.GoosetherConfuse,
        EMOJIS.FakeNooz,
        EMOJIS.pepeduck,
        "🦆",
      ],
    },
    {
      condition: (content: string) => {
        const bonk = new BonkUtilities(content);
        return bonk.isHorny(content);
      },
      emojis: [
        EMOJIS.AntiHornyElixir,
        EMOJIS.HmmMine,
        EMOJIS.HmmTher,
        EMOJIS.AetherBonk,
        EMOJIS.AetherBruh,
        EMOJIS.AetherYikes,
        EMOJIS.LumineMAD_REEE,
        EMOJIS.LuminePanic,
        EMOJIS.TarouAngy,
        "🔞",
      ],
    },
    {
      condition: (content: string) =>
        /(noodle)|<@!58143033065671434>|ramen|noods|<@&826393865275047946>/gimu.test(
          content,
        ),
      emojis: ["🍜", "🍝", "👶", "🤱", "🐣", "🍼", "🚼"],
    },
    {
      condition: (content: string) =>
        /(yawning|<@!98966314055405568>|<@98966314055405568>)/gimu.test(
          content,
        ),
      emojis: ["👴", "👑", "🐳", "🐋"],
    },
    {
      condition: (content: string) => /<@263408665539641344>/gimu.test(content),
      emojis: ["💀", "☠", "🦴"],
    },
    {
      condition: (content: string) => /a+r+a+n+a+r+a+/gimu.test(content),
      emojis: [EMOJIS.GoldenAranaraSmile, EMOJIS.GoldenAranaraWave],
    },
    {
      condition: (content: string) => /sus$/gimu.test(content),
      emojis: [EMOJIS.GoldenAranaraSmile, EMOJIS.SusgeMine, EMOJIS.PepeSus],
    },
  ];

  public async reactEmoji(message: Message, emoji: EmojiIdentifierResolvable) {
    const getEmojiId = () => {
      if (Object.values(EMOJIS).map(String).includes(emoji.toString())) {
        const matches = /\d{17,21}/.exec(emoji.toString());
        return matches ? matches[0] : null;
      }

      return null;
    };

    const emojiId = getEmojiId();
    const emote = emojiId
      ? this.container.client.emojis.resolve(emojiId)
      : emoji;

    try {
      message.react(emote || emoji);
    } catch {
      this.container.logger.warn(
        `Emoji ${emoji} is not a valid emoji, or the bot doesn't have access to it.`,
      );
    }
  }

  public run(message: Message) {
    const { content } = message;

    for (const prop of MessageReactions.emojisWithCondition) {
      if (prop.condition(content)) {
        const emote = pickRandom(prop.emojis);
        this.reactEmoji(message, emote);
      }
    }
  }
}
