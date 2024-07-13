import type { RouteGenericInterface, FastifyRequest, FastifyReply, FastifySchema, } from "fastify";

export type RouteType<T extends RouteGenericInterface = any> = Unfold<{
  type: "GET" | "POST" | "PUT" | "DELETE",
  url: string;
  schema?: FastifySchema;
  handler: RouteHandler<T>;
}>;

export type RouteHandler<T extends RouteGenericInterface = RouteGenericInterface> = (req: FastifyRequest<T>, res: FastifyReply) => any;