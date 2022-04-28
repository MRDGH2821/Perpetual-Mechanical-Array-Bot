/* eslint-disable camelcase */
module.exports = {
  apps: [
    {
      env_dev: { NODE_ENV: 'dev' },
      env_prod: { NODE_ENV: 'prod' },
      name: 'PMA-Bot',
      script: './src/index.js',
      watch: true,
    },
    {
      autorestart: false,
      name: 'Deploy PMA-Bot',
      script: './src/deploy-check.cjs',
      watch: false,
    },
  ],
};
