import { dbColl } from "@/mongodb";
import { objectArrayToObject } from "@/utils/dataConversion";
import type { QuestCategory } from "./types";

export const getQuestCategory = async (category: QuestCategory["category"]) => {
  return await questCategory[category]();
};

const questCategory = {
  eventList: async () => {
    const eventList = await dbColl("eventList").find({});
    return objectArrayToObject(eventList, "chapter");
  },
  main: async () => {
    const data = await dbColl("mainQuestSynopsis").find({});
    return data;
  },
  boss: async () => {
    const data = await dbColl("bossList").find({});
    return objectArrayToObject(data);
  },
  other: async () => {
    const data = await dbColl("questOther").find({});
    return data;
  },
  dungeon: async () => {
    const data = await dbColl("dungeonList").find({});
    return objectArrayToObject(data);
  },
};