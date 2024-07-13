import { dbColl } from "@/mongodb";
import { objectArrayToObject } from "@/utils/dataConversion";
import type { UnitCategory, UnitpineParams } from "./types";

export const getUnitList = (category: UnitCategory) => {
  return unitCategory[category]();
};

export const tokenData = async () => {
  return objectArrayToObject(await dbColl("tokenData").find({}), "id");
};

export const skinData = async () => {
  return await dbColl("unitSkin").find({});
};

export const unitLevelExps = async () => {
  const levelExps = await dbColl("unitLevelExp").find({});
  return Object.fromEntries(levelExps.map((item) => [item.rarityId, item.table]));
};

export const unitAwakenings = async () => {
  return objectArrayToObject(await dbColl("ability").findRange([90000, 100000]));
};

export const unitVoice = async (id: number) => {
  //语音
  const voiceData = await dbColl("srcUnitvoices").findSingle<{ voices: Record<string, string | string[]>; }>(id, "id", { voices: 1 });
  //语音台本
  const emotes = await dbColl("unitEmoteData").findSingle<{ data: { voice_id: number; }[]; }>(id, "id", { data: 1 });

  return { voices: voiceData?.voices || {}, voiceEmotes: objectArrayToObject(emotes?.data || [], "voice_id") };
};

export const unitSpineResource = async ({ id, key }: UnitpineParams) => {
  // 单位spineResource
  const spineResource = await dbColl("srcUnitSpine").findSingle(id + (key ? `_${key}` : ""), "id", { id: 0 });
  return spineResource || {};
};

export const featureExpandDescribeText = async () => {
  const raceExpandTextList = await dbColl("featureExpandDescribeText").find({});;
  return objectArrayToObject(raceExpandTextList);
};

const unitCategory = {
  character: async () => {
    const character = await dbColl("unit").findRange([0, 50000]);
    return objectArrayToObject(character);
  },
  token: async () => {
    const token = await dbColl("unit").findRange([50000, 60000]);
    return objectArrayToObject(token);
  },
  beastGod: async () => {
    return objectArrayToObject(await dbColl("bomcard").find({}));
  },
  enemy: async () => {
    return objectArrayToObject(await dbColl("enemy").find({}));
  }
};