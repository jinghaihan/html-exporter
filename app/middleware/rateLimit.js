const { RateLimit } = require('koa2-ratelimit');

const RateLimitMiddleware = () => {
  return RateLimit.middleware({
    interval: { min: 1 }, // 15 minutes = 15*60*1000
    max: 200, // limit each IP to 100 requests per interval
    async handler(ctx) {
      // @ts-ignore
      ctx.status = 429;
      ctx.body = {
        data: null,
        desc: '限流',
      };
    },
  });
};

module.exports = RateLimitMiddleware;
