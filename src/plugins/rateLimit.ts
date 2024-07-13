export const setRateLimit = () => {
  return [require("@fastify/rate-limit"), {
    global: true,
    max: 150,
    timeWindow: 1000 * 60 * 5,
    errorResponseBuilder: function (request: any, context: any) {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Requests exceed limit,Please try again later`,
        date: Date.now(),
        expiresIn: context.ttl
      };
    }
  }] as const;
};