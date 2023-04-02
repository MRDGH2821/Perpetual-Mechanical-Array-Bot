const { readdirSync } = require('fs');
const { resolve } = require('path');
const pluginsPath = resolve('./.yarn/unplugged/');
const hasPlugins = readdirSync(pluginsPath).join().includes('prettier-plugin');

module.exports = {
  ...require('prettier-config-mrdgh2821'),
  pluginSearchDirs: hasPlugins ? pluginsPath : undefined,
};
