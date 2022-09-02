/*
Original Author - Aroleaf
https://github.com/Khaenri-ah/ruinguard-core/blob/main/src/CooldownManager.ts

Adapted to use Base collection instead.
*/

import { BaseCollection } from 'detritus-utils';

export default class CoolDownManager {
  /** The default cool down in milliseconds */
  coolDown: number;

  /** All current cool downs */
  coolDowns: BaseCollection<string, number>;

  /**
   * Creates a new cool down manager
   * @param coolDown The default cool down in milliseconds
   */
  constructor(coolDown = 0) {
    this.coolDown = coolDown;
    this.coolDowns = new BaseCollection<string, number>();
  }

  /**
   * Adds a new cool down
   * @param key The identifier for this cool down
   * @param coolDown How long this cool down should last for, in milliseconds
   */
  async add(key: string, coolDown = this.coolDown): Promise<void> {
    this.coolDowns.set(key, Date.now() + coolDown);
  }

  /**
   * Checks if a cool down exists
   * @param key The identifier for this cool down
   * @returns How long this cool down still lasts, if found else false
   */
  async check(key: string): Promise<number | false> {
    const timestamp = this.coolDowns.get(key);
    return timestamp ? timestamp - Date.now() : false;
  }
}
