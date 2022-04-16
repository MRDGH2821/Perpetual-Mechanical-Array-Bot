import { Module } from '@ruinguard/core';
import esmImporter from './lib/esmImporter.js';

export default new Module({
  commands: await esmImporter('./pmaBaseModule/commands'),
  events: await esmImporter('./pmaBaseModule/events'),
  name: 'Base PMA module',
});
