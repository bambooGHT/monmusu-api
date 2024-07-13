import { dbColl } from "@/mongodb";
import type { QueryValue } from "@/mongodb/collOperate/types";
import type { Document } from "mongodb";

type QueryResult = { id: number; };

export const unitSearch = async (raceFeatureText: string, skillText: string) => {
  const collRaceFeature = dbColl("ability");
  const collSkill = dbColl("skill");
  let raceFeatureResults = raceFeatureText ?
    await collRaceFeature.regexMatch<QueryResult>(processQuery(raceFeatureText, 10000), "text.0") : undefined;
  let raceFeatureResultIds = raceFeatureResults?.map(p => p.id);

  let skillResults = skillText ?
    await collSkill.regexMatch<QueryResult>(processQuery(skillText, 10000, raceFeatureResultIds), "text.0") : undefined;

  if (skillResults?.length && raceFeatureResults?.length) {
    const resultIdList = new Set(skillResults.map(p => p.id));
    raceFeatureResults = raceFeatureResults.filter(p => resultIdList.has(p.id));
  }

  return processResults(raceFeatureResults, skillResults);
};

const processQuery = (text: string, maxRange: number, filterIdList?: number[]): QueryValue => {
  const filter: Document = { id: { $lt: maxRange }, name: { $ne: "ダミー" } };
  if (filterIdList?.[0]) filter.id.$in = filterIdList;

  return Object.assign(processQueryText(text), { find: filter });
};
const processQueryText = (text: string): Omit<QueryValue, "find"> => {
  const [includes, excludes] = text.split("|");
  return {
    includes: queryCondition(includes),
    excludes: queryCondition(excludes)
  };
};

const queryCondition = (text: string = "") => {
  return text.split(",").filter(Boolean);
};

const processResults = (raceFeatures: QueryResult[] = [], skills: QueryResult[] = []) => {
  const newSkills = skills[0] ? Object.values(skills.reduce((result: Record<string, QueryResult[]>, value) => {
    const id = +String(value.id).slice(-4);
    (result[id] ??= []).push(value);
    return result;
  }, {})).map(p => p.length > 1 ? p : p[0]) : skills;

  return { raceFeatures, skills: newSkills };
};