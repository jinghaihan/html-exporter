'use strict';

const actions = {};

function getAction(controller, path) {
  const controllerArray = Object.keys(controller);
  controllerArray.forEach(item => {
    const newPath = path + '/' + item;
    if (Object.keys(controller[item]).length > 0) {
      getAction(controller[item], newPath);
    } else {
      actions[newPath] = controller[item];
    }
  });
}


module.exports = app => {
  const { router, controller } = app;

  const routePrefix = '/api';

  getAction(controller, '');
  const pathKeys = Object.keys(actions);

  pathKeys.forEach(path => {
    router.get(routePrefix + path, actions[path]);
    router.post(routePrefix + path, actions[path]);
  });
};
