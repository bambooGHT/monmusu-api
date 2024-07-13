import https from "https";

export const httpsGet = <T = undefined, U extends keyof ResultType = "json">(url: string, returnType?: U): Promise<T extends undefined ? ResultType[U] : T> => {
  return new Promise((resolve) => {
    const data: any[] = [];
    https.get(url, { timeout: 30000 }, (res) => {
      res.on('data', (value) => {
        data.push(value);
      });
      res.on('end', async () => {
        const result = Buffer.concat(data);
        resolve(processData[returnType || "json"](result) as any);
      });
      res.on("error", () => { console.log(url); });
    });
  });
};

type ResultType = {
  string: string;
  buffer: Buffer;
  json: Object;
};

const processData: Record<keyof ResultType, (data: Buffer) => ResultType[keyof ResultType]> = {
  "string": (data) => data.toString(),
  "buffer": (data) => data,
  "json": (data) => JSON.parse(data.toString())
};