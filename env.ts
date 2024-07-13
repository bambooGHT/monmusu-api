import { readFileSync } from "fs";

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      DB_URL: string;
      NODE_ENV: "production" | "development";
      DB_USER_NAME: string;
      DB_USER_PASS: string;
    }
  }
}

((env: string) => {
  const data = readFileSync(`./.env.${env}`, "utf-8");
  data.split("\n").forEach((item) => {
    const [key, value] = item.split("=");
    process.env[key] = value;
  });
})(process.env.NODE_ENV);