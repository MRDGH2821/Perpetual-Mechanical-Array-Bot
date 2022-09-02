/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      env_dev: { NODE_ENV: 'dev' },
      env_prod: { NODE_ENV: 'prod' },
      name: 'PMA-Bot',
      script: './out/index.js',
      watch: true,
    },
  ],
};
