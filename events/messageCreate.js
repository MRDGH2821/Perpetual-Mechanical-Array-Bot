import { Event } from '@ruinguard/core';
// eslint-disable-next-line no-unused-vars
import { Message } from 'discord.js';

export default new Event({
  event: 'messageCreate',

  /**
   * message create event
   * @async
   * @function run
   * @param {Message} message - message object
   */
  async run(message) {}
});
