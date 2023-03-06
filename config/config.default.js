/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1678070911437_1773';

  // add your middleware config here
  config.middleware = [
    'rateLimit',
  ];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
  };

  // add your user config here
  const userConfig = {

  };

  config.cluster = {
    listen: {
      path: '',
      port: 8000,
      hostname: '0.0.0.0',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
