/*
Original Author - Aroleaf
https://github.com/Khaenri-ah/ruinguard-core/blob/main/src/CooldownManager.ts
*/

import { Collection } from "discord.js";

export default class CoolDownManager {
  coolDown: number;

  coolDowns: Collection<string, number>;

  constructor(coolDown = 0) {
    this.coolDown = coolDown;
    this.coolDowns = new Collection<string, number>();
  }

  add(key: string, coolDown = this.coolDown) {
    this.coolDowns.set(key, Date.now() + coolDown);
  }

  check(key: string) {
    const timestamp = this.coolDowns.get(key);

    return timestamp ? timestamp - Date.now() : -1;
  }
}
