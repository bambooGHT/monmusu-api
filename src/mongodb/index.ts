import CollOperate from "./collOperate";
import Mongo from "./mongo";
import type { CollIndex } from "./types";

const mongoLang = {
  'jp': new Mongo({
    url: process.env.DB_URL,
    dbName: 'monmusu-jp',
    options: {
      auth: {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PASS
      },
      authSource: "monmusu-jp"
    }
  })
};

export const dbColl = <K extends keyof CollIndex = keyof CollIndex>(coll: K, lang: "jp" = "jp") => {
  return new CollOperate<CollIndex[K]>(mongoLang[lang].getColl(coll));
};