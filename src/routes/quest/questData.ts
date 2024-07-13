import { dbColl } from "@/mongodb";
import { getChapterInfo } from "./chapterCategory";
import { questRewards } from "./questRewards";
import type { BattleEvent, LevelDetailedData, MapDeployEntries } from "./types";
import { BattleTalentId } from "./enums";
import { objectArrayToObject } from "@/utils/dataConversion";


export const questData = async (id: number) => {
  const chapterInfo = await getChapterInfo(id);
  const rewardsList = await questRewards(chapterInfo);
  const levelList = await getLevelList(chapterInfo.chapter, chapterInfo.contain_chapters);
  const missionList = await getMission(levelList.map((p: { id: number; }) => p.id));

  return { chapterInfo, rewardsList, levelList, missionList };
};

export const levelDetailedData = async (params: LevelDetailedData) => {
  const { id, battleMemberId, battleNPCId, attachTableId } = params;
  const mapData = (await dbColl("mapData").findSingle<{ groundId: number; deployEntries: MapDeployEntries[]; }>(id))!;
  const enemyBuffMenu = await dbColl("levelEnemyBuffMenu").findId(id, "quest_id");
  const battleMemberData = battleMemberId ? await dbColl("battleMember").findSingle(battleMemberId) : null;
  const battleNPCData = battleNPCId ? await dbColl("battleNPC").findSingle(battleNPCId) : null;
  const attachTable = attachTableId ? await dbColl("dungeonAttachRewards").findSingle<{ list: number[]; }>(attachTableId) : null;
  const { srcList: mapGroundSources } = (await dbColl("srcMapGround").findSingle<{ srcList: string[]; }>(mapData.groundId))!;
  const levelEventData = await getLevelEventData(mapData.deployEntries);

  return {
    mapData, battleMemberList: battleMemberData?.dataList, battleNPCList: battleNPCData?.dataList,
    enemyBuffMenu, mapGroundSources, attachIdList: attachTable?.list, ...levelEventData,
  };
};

const getLevelList = async (chapter: number | [number, number], chapters?: number[]): Promise<{ id: number; }[]> => {
  if (Array.isArray(chapter)) {
    return await dbColl("quest").findRange(chapter, "id");
  }
  return await dbColl("quest").findId(chapters ? chapters : [chapter], "chapter");
};

const getMission = async (ids: number[]) => {
  return await dbColl("mission").findId(ids, "target", { "target": 0 });
};

const getLevelEventData = async (deployEntries: MapDeployEntries[]) => {
  const events = deployEntries.flatMap(p => p.events);
  const eventIds = [...new Set(events.map(p => p.eventId))];
  const battleList: BattleEvent[] = await dbColl("battleEvent").findId(eventIds);
  const helpIdList: number[] = battleList.reduce((result: number[], value) => {
    value.talentList.forEach(p => {
      if (p.talentId === BattleTalentId.help_window) {
        result.push(p.param[0]);
      }
    });
    return result;
  }, []);
  const eventHelpInfoList = objectArrayToObject(await dbColl("helpWindow").findId(helpIdList));

  return { battleEventList: objectArrayToObject(battleList), eventHelpInfoList };
};