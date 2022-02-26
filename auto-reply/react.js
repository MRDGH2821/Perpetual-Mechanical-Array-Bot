function isHorny(text) {
  const notHorny =
      (/((n+o)|(n+o+t))\s((h+o+r+n+(y|i))|(s+e+g+s)|(s+e+x))/gimu).test(text),
    reallyHorny =
      (/h+o+r+n+(y|i)/gimu).test(text) ||
      (/s+e+g+s/gimu).test(text) ||
      (/s+e+x/gimu).test(text);

  if (reallyHorny && !notHorny) {
    console.log('Horny Detected in msg');
    return true;
  }
  return false;
}

export default function react(message) {
  const msg = message.content;
  if ((/(c+o+o+k+i+e)|🍪/gimu).test(msg)) {
    message.react('🍪');
  }
  if ((/(r+i+c+e)|🍚|🍙|🍘|🎑|🌾/gimu).test(msg)) {
    const emoteRices = [
        '🍚',
        '🍙',
        '🍘',
        '🎑',
        '🌾'
      ],
      randomRice = emoteRices[Math.floor(Math.random() * emoteRices.length)];
    message.react(randomRice);
  }
  if ((/(s+u+s+h+i)|🍣/gimu).test(msg)) {
    message.react('🍣');
  }
  if ((/(b+r+e+a+d)|🍞|🥐|🥖|🥪/gimu).test(msg)) {
    const breads = [
        '🍞',
        '🥐',
        '🥖',
        '🥪'
      ],
      randomBread = breads[Math.floor(Math.random() * breads.length)];
    message.react(randomBread).catch(console.error);
  }

  if (isHorny(msg)) {
    const emotes = [
        '<:AntiHornyElixir:810751842883207168>',
        '<:HmmTher:830243224105779290>',
        '<:HmmMine:830243258960838717>',
        '<:AetherBonk:821169357765345291>',
        '<:AetherBruh:813355624796520478>',
        '<:AetherYikes:810278255336489020>',
        '<:Keqing_No:804883023723233321>',
        '<:LumineMAD_REEE:814814997196308491>',
        '<:AetherMAD_REEE:865476945427824690>',
        '<:LuminePanic:814883112998666241>',
        '<:TarouAngy:854040153555468329>'
      ],
      randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(randomEmote).catch(console.error);
  }

  if ((/(q+u+a+c+k)|\b(h+o+n+k)|🦆/gimu).test(msg)) {
    const emotes = [
        '<:AetherNoU:905099437767024712>',
        '<:BoreasKek:829620211190595605>',
        '<:GoosetherConfuse:907307618677178368>',
        '<:FakeNooz:865259265471152138>',
        '<a:pepeduck:907293876073680946>',
        '<a:goose:907301647896690738>',
        '🦆'
      ],
      randomEmote = emotes[Math.floor(Math.random() * emotes.length)],
      unavailableEmotes = [
        '<:GoosetherAlert:907305613892145162>',
        '<:goose:907301800472883230>',
        '<:QuackStab:859333036851855361>',
        '<:goose_stab:907301775365767227>',
        '<:goose_pizza:907301733519196220>'
      ];
    console.log(unavailableEmotes[1]);
    message.react(randomEmote).catch(console.error);
  }

  if ((/(yawning|<@!98966314055405568>|<@98966314055405568>)/gimu).test(msg)) {
    const emotes = [
        '👴',
        '👑'
      ],
      randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(randomEmote).catch(console.error);
  }

  if ((/(noodle|<@!581430330653671434>|<@581430330653671434>)/gimu).test(msg)) {
    const emotes = [
        '🍜',
        '🍝'
      ],
      randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(randomEmote).catch(console.error);
  }
}
