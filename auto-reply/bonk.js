import { MessageEmbed } from 'discord.js';
import Bonkgif from '../lib/bonk-gifs.js';

const Bonk = new Bonkgif();

export default class bonk {
  constructor(message) {
    this.text = message.content;
    this.channel = message.channel;
    this.member = message.member;
    this.message = message;
  }

  crowdSourcedReasons = [
    `"Simply ungood" - <@!823564960671072336>`,
    `"You can do better than that" - <@!621330211220226049>`,
    `"Do better" - <@!621330211220226049>`,
    `"You suck" - <@!505390548232699906>`,
  ];

  reasons = [
    'You need no reason to be told',
    'No Horni <:HmmMine:830243258960838717>',
    'No Horni <:HmmTher:830243224105779290>',
    'No Segs <:HmmMine:830243258960838717>',
    'No Segs <:HmmTher:830243224105779290>',
    '<:AetherBonk:821169357765345291>',
  ];

  allReasons = this.crowdSourcedReasons.concat(this.reasons);

  reason = this.allReasons[Math.floor(Math.random() * this.allReasons.length)];

  isHorny() {
    //  console.log(this.text);
    return (
      /h+o+r+n+(y|i)/gim.test(this.text) ||
      /s+e+g+s/gim.test(this.text) ||
      /s+e+x/gim.test(this.text)
    );
  }

  async hornyBonk() {
    if (this.isHorny()) {
      const hornyBonk = new MessageEmbed()
        .setColor('#524437')
        .setTitle('**Bonked!**')
        .setDescription(`${this.reason}`)
        .setImage(Bonk.hornyBonkGif());
      if (this.channel.id !== '840268374621945906') {
        await this.message.reply({
          embeds: [hornyBonk],
          ephemeral: true,
        });
      }
    }
  }
}
