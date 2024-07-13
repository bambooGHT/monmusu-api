import { dbColl } from "@/mongodb";
import { QuestRewards } from "./enums";
import type { Chapter, QuestRewardsTypes } from "./types";

export const questRewards = async (chapter: Chapter): Promise<Promise<{
  list: any[];
  info?: any;
  title: string;
  type: QuestRewards;
}>> => {
  const rewardsTypes = await getQuestRewardTypes(chapter);
  const rewardsList = await Promise.all(rewardsTypes.map(async (p) => {
    const data = await rewardsType[p.type](p.ids);
    if (data.list[0]) {
      return {
        type: p.type,
        ...data
      };
    }
  }));

  return rewardsList.filter(Boolean) as any;
};

const getQuestRewardTypes = async (chapter: Chapter) => {
  const rewardsTypes: QuestRewardsTypes = [
    { type: QuestRewards.TYPE_2, ids: [chapter.id] },
    { type: QuestRewards.TYPE_4, ids: [chapter.id] },
  ];
  chapter.event_dataTable_id && rewardsTypes.push({
    type: QuestRewards.TYPE_3,
    ids: [chapter.event_dataTable_id]
  });
  if (chapter.shop_id) {
    const ids = chapter.shop_id2 ? [chapter.shop_id2, chapter.shop_id] : [chapter.shop_id];
    rewardsTypes.push({
      type: QuestRewards.TYPE_1,
      ids
    });
  }

  const time = chapter.close_time;
  if (time) {
    const value = await dbColl("bonusPass").findSingle<{ id: number; }>(new Date(time), "end_dt");

    if (value) {
      rewardsTypes.push({
        type: QuestRewards.TYPE_5,
        ids: [value.id]
      });
    }
  }

  return rewardsTypes;
};


const rewardsType: Record<QuestRewards, (ids: number[]) => Promise<{ list: any[], info?: any; title: string; }>> = {
  "1": async (ids) => {
    const list = await dbColl("shop").findId(ids, "tab_category");
    return { title: "shop", list };
  },
  "2": async (ids) => {
    const list = await dbColl("eventStarRatingRewards").findId(ids, "event_id");
    return { title: "star rewards", list };
  },
  "3": async (ids) => {
    const list = await dbColl("eventKillRewards").findId(ids, "reward_table_id");
    return { title: "kill rewards", list };
  },
  "4": async (ids) => {
    const info = await dbColl("eventSealedChara").findSingle(ids[0], "event_id");
    const list = await dbColl("eventSealedCharaMods").findId(ids, "event_id");
    if (info) info.wallet = "/icon/wallet/event_pt_bluesoul.png";

    return { title: "sealed character", info, list };
  },
  "5": async (ids) => {
    const list = await dbColl("bonusPassTrackReward").findId(ids, "pass_id");
    return { title: "bonus pass", list };
  }
};