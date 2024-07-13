import { readFileSync } from "fs";
import { defineConfig, type Format } from "tsup";
import { uncomment, removeImport, removeConditionJudgment } from "./tsup-plugins";

// 还没写完
export default defineConfig(() => {
  const envData = readFileSync(`./.env.production`, "utf-8");
  const envs = envData.split("\n").map((item) => {
    return item.split("=");
  });

  return [
    {
      entry: ["./index.ts"],
      outDir: 'dist',
      format: "cjs" as Format,
      splitting: false,
      clean: true,
      env: Object.fromEntries(envs),
      external: ["./env"],
      plugins: [uncomment(), removeImport(["env"]), removeConditionJudgment()]
    },
    {
      entry: ["./src/routes/test"],
      outDir: 'dist/routes/test',
      format: "cjs" as Format,
      splitting: false,
      clean: true,
    },
  ];
});