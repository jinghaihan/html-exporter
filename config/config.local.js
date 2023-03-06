module.exports = appInfo => {
  return {
    env: {
      process: 'prod',
      eureka: {
        serviceName: 'offline-report-maker',
        // 自身容器IP
        serviceIpAddr: '10.1.81.219',
        // 自身容器端口
        servicePort: 8000,
        // 用户名/密码
        username: 'admin',
        password: '123456',
        // 注册中心IP
        host: 'dev-eureka.ebapp-bdp-dreport.k8s.ebupt.com',
        // 注册中心端口
        port: 80,
      },
      export: {
        host: '127.0.0.1',
        port: '8080',
        callbackService: 'DREPORT-PORTAL',
      },
    },
  };
};
