import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandOptionType } from 'discord.js';
import { EMOJIS } from '../../lib/Constants';

const { LuminePadoru } = EMOJIS;

@ApplyOptions<Command.Options>({
  name: 'padoru',
  description: 'Send Padoru in chat!',
})
export default class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'padoru_count',
          description: 'Number of Padoru emotes to send',
          type: ApplicationCommandOptionType.Integer,
          required: false,
          max_value: 50,
          maxValue: 50,
        },
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public multiplyString(str: string, num: number) {
    let result = '';
    for (let i = 0; i < num; i += 1) {
      result += str;
    }
    return result;
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const padoruCount = interaction.options.getInteger('padoru_count') || 5;
    return interaction
      .reply({
        content: `Merry Christmas ${interaction.user}!`,
        fetchReply: true,
      })
      .then(async (msg) => msg.channel.send('Hashire Sori Yo'))
      .then(async (msg) => msg.channel.send('Kaze No You Ni'))
      .then(async (msg) => msg.channel.send('Tsukimihara Wo'))
      .then(async (msg) => msg.channel.send('Padoru Padoru!'))
      .then(async (msg) => msg.channel?.send(this.multiplyString(LuminePadoru, padoruCount)));
  }
}
