import "../env";
import Mongo from "@/mongodb/mongo";
import CollFind from "@/mongodb/collOperate/collFind";

const mongoLang = {
  'JP': new Mongo({
    url: process.env.DB_URL,
    dbName: "monmusu-jp",
    options: {
      auth: {
        username: process.env.DB_USER_NAME,
        password: process.env.DB_USER_PASS
      },
      authSource: "monmusu-jp"
    }
  })
};

(async () => {
  const coll = mongoLang["JP"].getColl("job");
  const findClass = new CollFind(coll, { _id: 0 });
  // const value = await findClass.findId([11011, 12034, 16021]);
  const value = await findClass.findRange([17000, 50015]);
  // const value = await findClass.regexMatch({
  //   includes: ["回復"],
  //   excludes: ["攻撃力"],
  //   find: {
  //     name: { $ne: "ダミー" },
  //     id: { $lt: 20000 }
  //   }
  // }, "text.0");
  if (value) {
    console.log(value.length);
    // console.log(1, value[0]);
  }
})();