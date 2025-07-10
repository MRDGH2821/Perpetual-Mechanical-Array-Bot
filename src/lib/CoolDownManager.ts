/*
Original Author - Aroleaf
https://github.com/Khaenri-ah/ruinguard-core/blob/main/src/CooldownManager.ts
*/

import { Collection } from "discord.js";

export default class CoolDownManager {
  public coolDown: number;

  public coolDowns: Collection<string, number>;

  public constructor(coolDown = 0) {
    this.coolDown = coolDown;
    this.coolDowns = new Collection<string, number>();
  }

  public add(key: string, coolDown = this.coolDown) {
    this.coolDowns.set(key, Date.now() + coolDown);
  }

  public check(key: string) {
    const timestamp = this.coolDowns.get(key);

    return timestamp ? timestamp - Date.now() : -1;
  }
}
