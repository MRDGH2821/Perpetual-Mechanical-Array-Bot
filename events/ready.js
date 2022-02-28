// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js';
import { Event } from '@ruinguard/core';

export default new Event({
  name: 'ready',
  once: true,

  /**
   * event run when ready
   * @function
   * @param {Client} client - client object
   */
  run(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
});
