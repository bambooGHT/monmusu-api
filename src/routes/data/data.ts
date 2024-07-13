import { objectArrayToObject } from "@/utils/dataConversion";
import { httpsGet } from "@/utils/https";
import { dbColl } from "@/mongodb";

const getNews = async () => {
  const { newsList } = await httpsGet<{ newsList: any[]; }>("https://assets.game-monmusu-td.net/res/information/news/1/news.json");
  return newsList;
};

const jobData = async () => {
  const job = objectArrayToObject(await dbColl("job").find({}));
  const jobFeatures = objectArrayToObject(await dbColl("ability").findRange([10000, 20000]));
  return { job, jobFeatures };
};

const wallet = async () => {
  return objectArrayToObject(await dbColl("wallet").find({}), "name");
};

const itemTemplate = async () => {
  return objectArrayToObject(await dbColl("itemTemplate").find({}), "item_id");
};

const equipment = async () => {
  const equipmentPattern = (await dbColl("equipmentPattern").findOne({}))!;
  const equipment = objectArrayToObject(await dbColl("equipment").find({}), "item_id");
  return { equipmentPattern: Object.fromEntries(equipmentPattern.data), equipment };
};

const weatherEffect = async () => {
  return objectArrayToObject(await dbColl("weatherEffect").find({}));
};

const picturebooks = async () => {
  const picturebooks = await dbColl("picturebook").find({});
  return objectArrayToObject(picturebooks);
};
export const routes = [
  {
    type: "GET",
    url: "/news",
    handler: getNews
  },
  {
    type: "GET",
    url: "/jobData",
    handler: jobData
  },
  {
    type: "GET",
    url: "/walletData",
    handler: wallet
  },
  {
    type: "GET",
    url: "/itemTemplateData",
    handler: itemTemplate
  },
  {
    type: "GET",
    url: "/equipmentData",
    handler: equipment
  },
  {
    type: "GET",
    url: "/weatherEffect",
    handler: weatherEffect
  },
  {
    type: "GET",
    url: "/picturebooks",
    handler: picturebooks
  }
];