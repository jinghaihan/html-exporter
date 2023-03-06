'use strict';


global.eureka = {};
global.actions = {};

function getAction(controller, path) {
  const controllerArray = Object.keys(controller);
  controllerArray.forEach(item => {
    const newPath = path + '/' + item;
    if (Object.keys(controller[item]).length > 0) {
      getAction(controller[item], newPath);
    } else {
      global.actions[newPath] = controller[item];
    }
  });
}

module.exports = app => {
  const { router, controller } = app;

  const routePrefix = '/api';

  getAction(controller, '');
  const paths = Object.keys(global.actions);

  // Router
  paths.forEach(path => {
    router.get(routePrefix + path, global.actions[path]);
    router.post(routePrefix + path, global.actions[path]);
  });

  // Eureka
  const { Eureka } = require('eureka-js-client');
  const eurekaOption = app.config.env.eureka;
  global.eureka = new Eureka({
    requestMiddleware: (requestOpts, done) => {
      requestOpts.auth = {
        user: eurekaOption.username,
        password: eurekaOption.password,
      };
      done(requestOpts);
    },
    instance: {
      app: eurekaOption.serviceName,
      hostName: eurekaOption.serviceName,
      ipAddr: eurekaOption.serviceIpAddr,
      port: {
        $: eurekaOption.servicePort,
        '@enabled': 'true',
      },
      vipAddress: eurekaOption.serviceName,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    eureka: {
      host: eurekaOption.host,
      port: eurekaOption.port,
      servicePath: '/eureka/apps/',
    },
  });
  global.eureka.start();
};
