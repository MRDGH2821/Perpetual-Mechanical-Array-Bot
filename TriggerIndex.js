import { Module } from '@ruinguard/core';
import { getDir } from 'file-ez';

export default await new Module({
  events: getDir('./triggers').path
});
