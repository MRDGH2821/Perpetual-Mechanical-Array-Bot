import { Module } from '@ruinguard/core';
import { resolve } from 'path';

export default await new Module({
  events: resolve('./triggers')
});
