function isHorny(text) {
  const reallyHorny =
    (/h+o+r+n+(y|i)/gim).test(text) ||
    (/s+e+g+s/gim).test(text) ||
    (/s+e+x/gim).test(text),
    notHorny =
    (/((n+o)|(n+o+t))\s((h+o+r+n+(y|i))|(s+e+g+s)|(s+e+x))/gim).test(text);

  if (reallyHorny && !notHorny) {
    console.log('Horny Detected in msg');
    return true;
  }
  return false;
}

export default function react(message) {
  const msg = message.content;
  if ((/(c+o+o+k+i+e)|🍪/gim).test(msg)) {
    message.react('🍪');
  }
  if ((/(r+i+c+e)|🍚|🍙|🍘|🎑|🌾/gim).test(msg)) {
    const rices = [
        '🍚',
        '🍙',
        '🍘',
        '🎑',
        '🌾'
      ],
      rice = rices[Math.floor(Math.random() * rices.length)];
    message.react(rice);
  }
  if ((/(s+u+s+h+i)|🍣/gim).test(msg)) {
    message.react('🍣');
  }
  if ((/(b+r+e+a+d)|🍞|🥐|🥖|🥪/gim).test(msg)) {
    const breads = [
        '🍞',
        '🥐',
        '🥖',
        '🥪'
      ],
      bread = breads[Math.floor(Math.random() * breads.length)];
    message.react(bread).catch(console.error);
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

      emote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(emote).catch(console.error);
  }

  if ((/(q+u+a+c+k)|\b(h+o+n+k)|🦆/gim).test(msg)) {
    const unavaiableEmotes = [
      '<:GoosetherAlert:907305613892145162>',
      '<:goose:907301800472883230>',
      '<:QuackStab:859333036851855361>',
      '<:goose_stab:907301775365767227>',
      '<:goose_pizza:907301733519196220>'
    ];
    console.log(unavaiableEmotes[1]);
    const emotes = [
        '<:AetherNoU:905099437767024712>',
        '<:BoreasKek:829620211190595605>',
        '<:GoosetherConfuse:907307618677178368>',
        '<:FakeNooz:865259265471152138>',
        '<a:pepeduck:907293876073680946>',
        '<a:goose:907301647896690738>',
        '🦆'
      ],
      emote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(emote).catch(console.error);
  }

  if ((/(yawning|<@!98966314055405568>|<@98966314055405568>)/gim).test(msg)) {
    const emotes = [
        '👴',
        '👑'
      ],
      emote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(emote).catch(console.error);
  }

  if ((/(noodle|<@!581430330653671434>|<@581430330653671434>)/gim).test(msg)) {
    const emotes = [
        '🍜',
        '🍝'
      ],
      emote = emotes[Math.floor(Math.random() * emotes.length)];
    message.react(emote).catch(console.error);
  }
}
