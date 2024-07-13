import { dbColl } from "@/mongodb";
import { objectArrayToObject } from "@/utils/dataConversion";

type AttachObtainWays = {
  data: [string, {
    [index: string]: {
      shopId: number;
    }[];
  }][];
};

const getAttachObtainWays = async () => {
  const { data: attachObtainWays } = (await dbColl("attachObtainWays").findOne<AttachObtainWays>({}))!;
  const shopIdList = attachObtainWays.reduce((data: number[], [id, value]) => {
    value.shop?.forEach((p) => {
      data.push(p.shopId);
    });
    return data;
  }, []);
  const shopData = objectArrayToObject(await dbColl("shop").findId(shopIdList));

  return { attachObtainWays: Object.fromEntries(attachObtainWays), shopData };
};

export const routes = [
  {
    type: "GET",
    url: "/attach",
    handler: () => {
      return dbColl("attach").find({});
    }
  },
  {
    type: "GET",
    url: "/attachObtainWays",
    handler: getAttachObtainWays
  }
];