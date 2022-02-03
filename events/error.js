import { Event } from '@ruinguard/core';

export default new Event({
  event: 'error',
  run(err) {
    console.log('Error: ');
    console.error(err);
  },
});
