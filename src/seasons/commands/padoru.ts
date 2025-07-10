import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionContextType,
  roleMention,
} from "discord.js";
import { EMOJIS, ROLE_IDS } from "../../lib/Constants.js";

const { LuminePadoru } = EMOJIS;

@ApplyOptions<Command.Options>({
  name: "padoru",
  description: "Send Padoru in chat!",
})
export default class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      type: ApplicationCommandType.ChatInput,
      contexts: [InteractionContextType.Guild],
      options: [
        {
          name: "padoru_count",
          description: "Number of Padoru emotes to send",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          max_value: 50,
          maxValue: 50,
        },
        {
          name: "ping_archons",
          description: "Ping Archons?",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    });
  }

  public multiplyString(str: string, num: number) {
    let result = "";
    for (let _ = 0; _ < num; _ += 1) {
      result += str;
    }

    return result;
  }

  public override async chatInputRun(
    interaction: Command.ChatInputCommandInteraction,
  ) {
    const padoruCount = interaction.options.getInteger("padoru_count") ?? 5;
    const pingArchons = interaction.options.getBoolean("ping_archons") ?? false;
    const channel = await interaction.channel?.fetch(true);
    if (!channel?.isSendable()) {
      return interaction.reply({
        content: "I cannot Padoru Poem in this channel 😕",
        ephemeral: true,
      });
    }

    const padoruPoem = [
      "Hashire Sori Yo",
      "Kaze No You Ni",
      "Tsukimihara Wo",
      "Padoru Padoru!",
    ].map(
      (line) =>
        `${pingArchons ? `${roleMention(ROLE_IDS.OTHERS.ARCHONS)} ` : ""}${line}`,
    );
    await interaction.reply({
      content: `Merry Christmas ${interaction.user}!`,
    });
    await channel.send(padoruPoem[0]!);
    await channel.send(padoruPoem[1]!);
    await channel.send(padoruPoem[2]!);
    await channel.send(padoruPoem[3]!);

    return channel.send(this.multiplyString(LuminePadoru, padoruCount));
  }
}
