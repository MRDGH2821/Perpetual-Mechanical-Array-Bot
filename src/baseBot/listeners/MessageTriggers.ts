import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, type ListenerOptions } from '@sapphire/framework';
import { ButtonStyle, ComponentType, userMention, type Message } from 'discord.js';
import AutoResponseTrigger from '../lib/AutoResponseTrigger';

const triggers: AutoResponseTrigger[] = [
  new AutoResponseTrigger({
    name: 'Baguette',
    quotes: [userMention('823564960671072336')],
    conditions: {
      envName: 'AUTORESPONSE_BAGUETTE',
      searchString: 'baguette',
    },
    quoteCategories: [],
    coolDownTime: 3000,
  }),
  new AutoResponseTrigger({
    name: 'FBI',
    quotes: [
      '*FBI investigation commences*',
      '*FBI is coming*',
      'Did you know FBI stands for Faraway Buddy Insideyourdevice ?',
      'https://tenor.com/view/chicken-fbi-skeptic-chicken-funny-gif-14153035',
      'https://tenor.com/view/dark-red-fbi-warning-gif-18254979',
      'https://tenor.com/view/fbi-swat-busted-police-open-up-gif-16928811',
      'https://tenor.com/view/priyam-raj-fbi-meme-fbi-open-up-fbi-gamer-gif-19628656',
      'https://tenor.com/view/traffic-fbi-open-up-raid-gif-13450966',
      'Rick Astley was a part of F.B.I. ||(music band)||',
      'You know what, I wonder if its actually NSA which spies or FBI :thinking:',
    ],
    quoteCategories: ['FBIGifs', 'FBIQuotes'],
    conditions: {
      envName: 'AUTORESPONSE_FBI',
      searchString: 'fbi',
    },
    coolDownTime: 3000,
  }),
  new AutoResponseTrigger({
    name: 'Yoyoverse',
    quotes: [`Did you know that saying yoyoverse pings ${userMention('476219631539847188')}`],
    conditions: {
      envName: 'AUTORESPONSE_YOYOVERSE',
      searchString: 'yoyoverse',
    },
    quoteCategories: ['yoyoverseQuotes'],
    coolDownTime: 3000,
  }),
  new AutoResponseTrigger({
    name: 'BanHammer',
    quotes: ['Who are we banning today? :smirk:'],
    conditions: {
      searchString: /(b+a+n+)\s*(h+a+m+m+e+r+)/gimu,
      customCondition: () => (message: Message) => {
        if (message.member) {
          return message.member.permissions.has('BanMembers');
        }
        return false;
      },
    },
    quoteCategories: ['banHammerReasons'],
    allowedMentions: {
      roles: [],
      users: [],
      repliedUser: true,
    },
    customAction: () => (sourceMessage, botMessage) => {
      botMessage.edit({
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                style: ButtonStyle.Link,
                label: 'See the mod in action!',
                url: sourceMessage.url,
              },
            ],
          },
        ],
      });
    },
  }),
];

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate,
  name: 'MessageTriggers',
  enabled: true,
})
export default class MessageTriggers extends Listener<typeof Events.MessageCreate> {
  public run(message: Message) {
    if (message.channelId === '840268374621945906') {
      return;
    }
    if (message.author.bot) {
      return;
    }
    this.container.logger.debug('Got message:', message.content);

    triggers.forEach(async (trigger) => {
      let customConditionFlag = false;
      customConditionFlag = trigger.conditions.customCondition
        ? await trigger.conditions.customCondition()(message)
        : true;
      if (!trigger.canAct(message.content) && !customConditionFlag) {
        // this.container.logger.warn(`${trigger.name} cannot act`);
        return;
      }
      const quote = trigger.getQuote();
      // this.container.logger.debug(`Can actually act ${trigger.name}`);
      message
        .reply({
          content: quote,
          allowedMentions: trigger.allowedMentions,
        })
        .then((botMsg) => {
          trigger.refreshCoolDown();
          if (trigger.customAction) trigger.customAction()(message, botMsg);
        })
        .catch(this.container.logger.debug);
    });
  }
}
