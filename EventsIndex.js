import { Module } from '@ruinguard/core';
import { getDir } from 'file-ez';

export default await new Module({
  events: getDir('./events').path,
  intents: [
    1 << 0,
    1 << 9
  ]
});
