import Fastify from 'fastify';
import { setCors, serveStaticFile, setRateLimit, importRoute } from './plugins';

const app = Fastify({ bodyLimit: 1024 * 1024 * 3 });

(async () => {
  app.addHook("onRequest", setCors);
  
  if (process.env.NODE_ENV === "development") {
    app.register(...serveStaticFile());
  }
  await app.register(...setRateLimit());
  await importRoute();

  app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    console.log(`server listening on ${address}`);
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
})();

export default app;