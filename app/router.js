'use strict';


module.exports = app => {
  const { router, controller } = app;

  router.post('/api/pdf/export', controller.pdf.export);
};
