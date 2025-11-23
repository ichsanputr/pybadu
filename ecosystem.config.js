/* eslint-env node */
// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'pybadu',
      script: './.output/server/index.mjs',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 9001,
        NITRO_PORT: 9001,
        NITRO_HOST: '0.0.0.0',
        NUXT_PUBLIC_API_BASE_URL: 'https://api.budibadu.com'
      }
    },
  ],
}