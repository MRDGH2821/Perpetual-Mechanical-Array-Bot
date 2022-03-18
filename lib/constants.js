export const AnemoColor = "#00ffcc",
  AnemoIcon =
    "https://cdn.discordapp.com/emojis/803516622772895764.webp?&quality=lossless",
  CopiumIcon =
    "https://cdn.discordapp.com/emojis/897176156057518130.webp?&quality=lossless",
  ElectroColor = "#a500ff",
  ElectroIcon =
    "https://cdn.discordapp.com/emojis/803516644923146260.webp?&quality=lossless",
  EmbedColor = "#e0d1bd",
  EmbedColorHex = 0xe0d1bd,
  Error = "#ff0033",
  GeoColor = "#fce200",
  GeoIcon =
    "https://cdn.discordapp.com/emojis/803516612430135326.webp?&quality=lossless",
  Success = "#00c455",
  UnivColor = "#fffffd";

// eslint-disable-next-line one-var
export const Colors = {
    AnemoColor,
    ElectroColor,
    EmbedColor,
    EmbedColorHex,
    Error,
    GeoColor,
    Success,
    UnivColor
  },
  ElementIcons = {
    AnemoIcon,
    CopiumIcon,
    ElectroIcon,
    GeoIcon
  };

/**
 * returns picture of respective element name
 * @function elementIcon
 * @param {string} eleName - element name
 * @returns {{icon:string, name:string, skill:string, color:string}} - stat properties of element icon
 */
export function elementIcon(eleName) {
  const stats = {
    color: "",
    icon: "",
    name: "",
    skill: ""
  };
  switch (eleName) {
  case "anemo-dmg-skill": {
    stats.icon = AnemoIcon;
    stats.name = "Anemo Traveler";
    stats.skill = "Palm Vortex - Max Storm Damage";
    stats.color = AnemoColor;
    break;
  }
  case "geo-dmg-skill": {
    stats.icon = GeoIcon;
    stats.name = "Geo Traveler";
    stats.skill = "Starfell sword";
    stats.color = GeoColor;
    break;
  }
  case "electro-dmg-skill": {
    stats.icon = ElectroIcon;
    stats.name = "Electro Traveler";
    stats.skill = "Lightening Blade";
    stats.color = ElectroColor;
    break;
  }
  case "uni-dmg-n5": {
    stats.icon = CopiumIcon;
    stats.name = "Universal Traveler";
    stats.skill = "Traveler's Normal Attack 5th Hit";
    stats.color = UnivColor;
    break;
  }
    // no default
  }
  return stats;
}
