import { MessageComponentButtonStyles } from 'detritus-client/lib/constants';
import { InteractionCommand } from 'detritus-client/lib/interaction';
import { ComponentActionRow } from 'detritus-client/lib/utils';

import { COLORS } from '../../lib/Constants';

const pkg = require('../../../package.json');

const deps = Object.entries(pkg.dependencies)
  .map(([depName, depVer]) => `${depName}: ${depVer}`)
  .join('\n');

export default new InteractionCommand({
  name: 'about',
  description: 'About the bot',
  run(ctx) {
    ctx.editOrRespond({
      embed: {
        title: '**About the bot**',
        color: COLORS.EMBED_COLOR,
        description: `Version: ${pkg.version}\nMade by: ${
          ctx.client.owners.first()?.mention
        }\n\nThe bot uses:\n ${deps}`,
      },
      components: [
        new ComponentActionRow().addButton({
          label: 'Source Code',
          style: MessageComponentButtonStyles.LINK,
          url: pkg.homepage,
        }),
      ],
    });
  },
});
