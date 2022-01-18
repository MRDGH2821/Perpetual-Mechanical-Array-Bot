import { Module } from '@ruinguard/core';
import { getDir } from 'file-ez';

export default await new Module({
  commands: getDir('./commands').path,
  intents: [1 << 0],
});
