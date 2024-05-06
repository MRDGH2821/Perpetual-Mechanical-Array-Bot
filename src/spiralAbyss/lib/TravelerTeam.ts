import { Time } from '@sapphire/time-utilities';
import { toTitleCase } from '@sapphire/utilities';
import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  StringSelectMenuInteraction,
} from 'discord.js';
import { ButtonStyle, ComponentType, TextInputStyle } from 'discord.js';
import { type Character, characters } from 'genshin-db';
import { crownProps } from '../../hallOfFame/lib/Utilities';
import { EMOJIS } from '../../lib/Constants';
import { parseElement } from '../../lib/utils';
import type { ELEMENTS } from '../../typeDefs/typeDefs';

export default class TravelerTeam {
  element?: ELEMENTS;

  #teamMate1?: Character;

  #teamMate2?: Character;

  #teamMate3?: Character;

  interaction: ChatInputCommandInteraction;

  user: ChatInputCommandInteraction['user'];

  #doneElements: ELEMENTS[] = [];

  finalised: boolean = false;

  constructor(
    interaction: ChatInputCommandInteraction,
    user: ChatInputCommandInteraction['user'],
    doneElements: ELEMENTS[] = [],
  ) {
    this.interaction = interaction;
    this.user = user;
    this.#doneElements = doneElements;

    if (!this.interaction.deferred) {
      this.interaction.deferReply();
    }
  }

  async askElement() {
    return this.interaction
      .editReply({
        content: 'Which team to make?',
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.StringSelect,
                customId: 'traveler_element',
                placeholder: 'Select an element',
                options: [
                  {
                    label: 'Anemo',
                    value: 'anemo',
                    emoji: EMOJIS.Anemo,
                  },
                  {
                    label: 'Geo',
                    value: 'geo',
                    emoji: EMOJIS.Geo,
                  },
                  {
                    label: 'Electro',
                    value: 'electro',
                    emoji: EMOJIS.Electro,
                  },
                  {
                    label: 'Dendro',
                    value: 'dendro',
                    emoji: EMOJIS.Dendro,
                  },
                  {
                    label: 'Hydro',
                    value: 'hydro',
                    emoji: EMOJIS.Hydro,
                  },
                  {
                    label: 'Pyro',
                    value: 'pyro',
                    emoji: EMOJIS.Pyro,
                  },
                  {
                    label: 'Cryo',
                    value: 'cryo',
                    emoji: EMOJIS.Cryo,
                  },
                ].filter((opt) => !this.#doneElements.includes(parseElement(opt.value))),
              },
            ],
          },
        ],
      })
      .then(async (msg) =>
        msg.awaitMessageComponent({
          componentType: ComponentType.StringSelect,
          time: 1 * Time.Minute,
          dispose: true,
        }),
      )
      .then((mtx) => {
        this.element = parseElement(mtx.values[0]);
        return mtx;
      });
  }

  async askTeamMates(interaction: StringSelectMenuInteraction | ButtonInteraction) {
    const teamId = `${this.element}_team`;
    await interaction.showModal({
      title: `Input ${this.user.username}'s ${this.element} Traveler Team`,
      custom_id: teamId,
      customId: teamId,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              required: true,
              custom_id: `${teamId}_mate_1`,
              label: 'Team Mate 1',
              style: TextInputStyle.Short,
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              required: true,
              custom_id: `${teamId}_mate_2`,
              label: 'Team Mate 2',
              style: TextInputStyle.Short,
            },
          ],
        },
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.TextInput,
              required: true,
              custom_id: `${teamId}_mate_3`,
              label: 'Team Mate 3',
              style: TextInputStyle.Short,
            },
          ],
        },
      ],
    });

    const charSearchOpt = {
      matchAliases: true,
      matchVariants: true,
      matchAltNames: true,
      matchNames: true,
    };

    return interaction
      .awaitModalSubmit({
        time: 3 * Time.Minute,
        async filter(itx) {
          await itx.deferUpdate();
          return itx.customId === teamId;
        },
      })
      .then((modalItx) => {
        const mate1 = modalItx.fields.getTextInputValue(`${teamId}_mate_1`);
        const mate2 = modalItx.fields.getTextInputValue(`${teamId}_mate_2`);
        const mate3 = modalItx.fields.getTextInputValue(`${teamId}_mate_3`);

        const char1 = characters(mate1, charSearchOpt);
        const char2 = characters(mate2, charSearchOpt);
        const char3 = characters(mate3, charSearchOpt);

        if (!char1 || !char2 || !char3) {
          throw new Error('Invalid Character Name(s)', {
            cause: `Got ${mate1}, ${mate2}, ${mate3} as team mates`,
          });
        }
        this.#teamMate1 = char1;
        this.#teamMate2 = char2;
        this.#teamMate3 = char3;
        return modalItx;
      })
      .catch(async (err) =>
        this.interaction.editReply({
          content: `Error: ${err.message}\nCause: ${err.cause}\n\nRe-run the command again to make the team.`,
          components: [],
        }),
      );
  }

  isTeamMade() {
    return !!this.#teamMate1 && !!this.#teamMate2 && !!this.#teamMate3;
  }

  isElementSet() {
    return !!this.element;
  }

  async confirmTeam() {
    return this.interaction
      .editReply({
        content: `Confirm Team?\n\nTeam **${toTitleCase(this.element!)}**\n1. ${
          this.#teamMate1!.name
        } \n2. ${this.#teamMate2!.name} \n3. ${this.#teamMate3!.name}`,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                customId: 'confirm_team',
                label: 'Confirm',
                style: ButtonStyle.Success,
              },
              {
                type: ComponentType.Button,
                customId: 'remake_team',
                label: 'Remake',
                style: ButtonStyle.Primary,
              },
            ],
          },
        ],
      })
      .then(async (msg) =>
        msg.awaitMessageComponent({
          componentType: ComponentType.Button,
          time: 1 * Time.Minute,
          dispose: true,
        }),
      )
      .then(async (itx) => {
        if (itx.customId === 'confirm_team') {
          this.finalised = true;
          return this;
        }
        return this.buildTeam();
      });
  }

  async buildTeam(): Promise<this> {
    return this.askElement()
      .then(async (stx) => this.askTeamMates(stx))
      .then(async () => this.confirmTeam())
      .then(() => this);
  }

  toString() {
    if (this.finalised) {
      if (!this.element) throw new Error('Element not set');
      const element = toTitleCase(this.element);
      const traveler = `**${element} Traveler**`;

      if (!this.#teamMate1 || !this.#teamMate2 || !this.#teamMate3) {
        throw new Error('Team not finalised');
      }
      const name1 = this.#teamMate1.name;
      const name2 = this.#teamMate2.name;
      const name3 = this.#teamMate3.name;

      const eleProp = crownProps(this.element);
      return `${eleProp.emoji} ${traveler} | ${name1} | ${name2} | ${name3}`;
    }
    throw new Error('Team not finalised');
  }
}
