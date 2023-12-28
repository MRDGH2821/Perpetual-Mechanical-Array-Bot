import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationCommandOptionType, roleMention } from 'discord.js';
import { EMOJIS, ROLE_IDS } from '../../lib/Constants';

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
        {
          name: 'ping_archons',
          description: 'Ping Archons?',
          type: ApplicationCommandOptionType.Boolean,
          required: false,
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
    const pingArchons = interaction.options.getBoolean('ping_archons') || false;

    const padoruPoem = [
      'Hashire Sori Yo',
      'Kaze No You Ni',
      'Tsukimihara Wo',
      'Padoru Padoru!',
    ].map((line) => `${pingArchons ? `${roleMention(ROLE_IDS.OTHERS.ARCHONS)} ` : ''}${line}`);

    return interaction
      .reply({
        content: `Merry Christmas ${interaction.user}!`,
        fetchReply: true,
      })
      .then(async (msg) => msg.channel.send(padoruPoem[0]))
      .then(async (msg) => msg.channel.send(padoruPoem[1]))
      .then(async (msg) => msg.channel.send(padoruPoem[2]))
      .then(async (msg) => msg.channel.send(padoruPoem[3]))
      .then(async (msg) => msg.channel?.send(this.multiplyString(LuminePadoru, padoruCount)));
  }
}
