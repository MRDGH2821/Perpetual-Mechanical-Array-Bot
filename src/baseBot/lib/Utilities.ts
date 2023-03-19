import { CacheType, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import type { DamageType, ELEMENTS, JSONCmd } from '../../typeDefs/typeDefs';
import { findElementProp, findTech } from './TravelerTechnologies';

export function replyTech(
  interaction: ChatInputCommandInteraction<CacheType>,
  element: ELEMENTS,
  type: DamageType,
) {
  const tech = interaction.options.getString('tech');
  const gif = findTech({
    element,
    type,
    id: tech!,
  })?.gif;
  return interaction.reply({
    content: gif ?? `Invalid tech name entered. (Got ${tech})`,
    flags: gif ? undefined : MessageFlags.Ephemeral,
  });
}

export const stuff = 'stuff';

export function travelerCmdProps(element: ELEMENTS) {
  const prop = findElementProp(element);
  const cmdDef: JSONCmd = {
    name: prop.shortName,
    description: prop.name,
    options: [
      {
        type: 1,
        name: 'guide',
        description: `${prop.name} Guide on Keqing Mains`,
      },
      {
        type: 1,
        name: prop.burst.name,
        description: `${prop.shortName.toUpperCase()} Burst techs`,
        options: [
          {
            type: 3,
            name: 'tech',
            description: 'Select tech',
            required: true,
            autocomplete: true,
          },
        ],
      },
      {
        type: 1,
        name: prop.skill.name,
        description: `${prop.shortName.toUpperCase()} Skill techs`,
        options: [
          {
            type: 3,
            name: 'tech',
            description: 'Select tech',
            required: true,
            autocomplete: true,
          },
        ],
      },
    ],
  };
  return { commandDefinition: cmdDef, prop };
}
