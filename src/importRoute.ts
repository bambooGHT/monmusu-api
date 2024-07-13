import type { RouteType } from "./routes/types";
import { readdir } from "fs/promises";
import app from "./main.js";

export const importRoute = async () => {
  const path = "/routes/";
  const fileNames = (await readdir(__dirname + path)).filter(p => !p.includes("."));

  for (const fileName of fileNames) {
    const { routes }: { routes: RouteType[]; } = await import(`.${path}${fileName}/${fileName}.js`);
    for (const { type: method, url, schema, handler } of routes) {
      app.route({ method, url, schema, handler });
    }
  }
};