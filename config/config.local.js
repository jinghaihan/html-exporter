module.exports = appInfo => {
  return {
    env: {
      host: '127.0.0.1',
      port: '8100',
      callbackUrl: 'http://dev.ebapp-bdp-dreport.k8s.ebupt.com/api/dreport-portal/dreport/pdf/file',
    },
  };
};
