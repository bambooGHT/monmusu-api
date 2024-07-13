export const serveStaticFile = () => {
  return [require("@fastify/static"), {
    root: `${process.cwd()}/assets`,
    cacheControl: true,
    maxAge: 1296000000
  }] as const;
};