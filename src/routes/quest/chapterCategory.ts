import { dbColl } from "@/mongodb";
import type { Chapter, ChapterBoss, ChapterEvent } from "./types";

export const getChapterInfo = (id: number) => {
  const category = getChapterCategory(id);
  return chapterCategory[category](id);
};


const getChapterCategory = (id: number) => {
  let value = "eventList";
  if (id <= 5000) {
    value = "main";
  } else if (id < 10000) {
    value = "other";
  } else if (id < 55000) {
    value = "boss";
  } else if (id < 57000) {
    value = "dungeons";
  }

  return value;
};


const chapterCategory: Record<string, (id: number) => Promise<Chapter>> = {
  eventList: async (id) => {
    const eventList = (await dbColl("eventList").findSingle<ChapterEvent>(id, "chapter"))!;
    const { x_src, event_type, banner_src, banner_src2, ...result } = eventList;
    result.src = banner_src2;
    return result;
  },

  main: async (id) => {
    const data = (await dbColl("mainQuestSynopsis").findSingle(id))!;
    const { id: chapter, after_message: text } = data;
    return { id: 0, chapter, name: id === 1 ? "序章" : `${id - 1}章`, text };
  },

  boss: async (id) => {
    const data = (await dbColl("bossList").findSingle<ChapterBoss>(id))!;
    const { openTime: open_time, closeTime: close_time, questRangeIdTuple: chapter, name, ...value } = data;
    return { open_time, close_time, chapter, name: name.replace("lv.1", ""), ...value };
  },

  other: async (id) => {
    const data = (await dbColl("questOther").findSingle(id))!;
    return { id, name: data.title, chapter: id, text: "" };
  },

  dungeons: async (id) => {
    const data = (await dbColl("dungeonList").findSingle(id))!;
    const { questRangeIdTuple: chapter, ...value } = data;
    return { ...value, chapter, text: "" } as any;
  },
};
