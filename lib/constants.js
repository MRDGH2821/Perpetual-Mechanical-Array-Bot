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
  LighteningBladeIcon =
    "https://cdn.discordapp.com/attachments/817208583988051999/886635086362071040/ElectroAether3.png",
  PalmVortexIcon =
    "https://cdn.discordapp.com/emojis/840965851199832087.png?v=1",
  SpiralAbyssColor = "#0098a3",
  SpiralAbyssIcon =
    "https://cdn.discordapp.com/emojis/806999511096361031.png?v=1",
  StarFellIcon = "https://cdn.discordapp.com/emojis/840965876370112532.png?v=1",
  Success = "#00c455",
  UnivColor = "#fffffd",
  VoidColor = "#01152d",
  VoidIcon = "https://cdn.discordapp.com/emojis/886587673408569394.png?v=1";

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

/**
 * returns properties of given category
 * @function crownProps
 * @param {string} category
 * @returns {{icon:string, name:string, color:string}} - stat properties of category
 */
export function hallOfFameProps(category) {
  const props = {
    color: "",
    icon: "",
    name: ""
  };

  switch (category) {
  case "anemo-crown": {
    props.color = AnemoColor;
    props.icon = PalmVortexIcon;
    props.name = "Herrscher of Wind :Anemo:";
    break;
  }
  case "geo-crown": {
    props.color = GeoColor;
    props.icon = StarFellIcon;
    props.name = "Jūnzhǔ of Earth :Geo:";
    break;
  }
  case "electro-crown": {
    props.color = ElectroColor;
    props.icon = LighteningBladeIcon;
    props.name = "Ten'nō of Thunder :Electro:";
    break;
  }
  case "unaligned-crown": {
    props.color = VoidColor;
    props.icon = VoidIcon;
    props.name = "Arbitrator of Fate :void:";
    break;
  }
  case "spiral-abyss-once": {
    props.color = SpiralAbyssColor;
    props.icon = SpiralAbyssIcon;
    props.name = "Abyssal Conquerors: All time";
    break;
  }
  case "current-spiral-abyss": {
    props.color = SpiralAbyssColor;
    props.icon = SpiralAbyssIcon;
    props.name = "Abyssal Conquerors: Current Cycle";
    break;
  }
    // no default
  }
  return props;
}
