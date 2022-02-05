/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      env_dev: { NODE_ENV: 'dev' },
      env_prod: { NODE_ENV: 'prod' },
      name: 'PMA-Bot',
      script: './index.js',
      watch: '.',
    },
    {
      autorestart: false,
      name: 'Deploy PMA-Bot',
      script: './deploy-check.cjs',
      watch: false,
    },
  ],
};
