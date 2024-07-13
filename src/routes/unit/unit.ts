import { UnitAbilities, UnitCategory, UnitSrarch, UnitVoiceId, UnitpineParams } from "./types";
import {
  getUnitList, tokenData, skinData, unitAwakenings, unitLevelExps,
  unitVoice, unitSpineResource, featureExpandDescribeText
} from "./unitData";
import { unitAbilities } from "./unitAbilities";
import type { FastifyRequest } from "fastify";
import { unitSearch } from "./unitSearch";


export const routes = [
  {
    type: "GET",
    url: "/unitList/:category",
    schema: { params: { category: UnitCategory } },
    handler: (req: FastifyRequest<{ Params: { category: UnitCategory; }; }>) => {
      return getUnitList(req.params.category);
    }
  },
  {
    type: "GET",
    url: "/tokenData",
    handler: tokenData
  },
  {
    type: "GET",
    url: "/skinData",
    handler: skinData
  },
  {
    type: "GET",
    url: "/unitLevelExps",
    handler: unitLevelExps
  },
  {
    type: "GET",
    url: "/unitAwakenings",
    handler: unitAwakenings
  },
  {
    type: "GET",
    url: "/unitAbilities",
    schema: {
      querystring: UnitAbilities
    },
    handler: (req: FastifyRequest<{ Querystring: UnitAbilities; }>) => {
      return unitAbilities(req.query);
    }
  },
  {
    type: "GET",
    url: "/unitVoice/:id",
    schema: {
      params: { id: UnitVoiceId }
    },
    handler: (req: FastifyRequest<{ Params: { id: number; }; }>) => {
      return unitVoice(req.params.id);
    }
  },
  {
    type: "GET",
    url: "/unitSpineResource",
    schema: {
      querystring: UnitpineParams
    },
    handler: (req: FastifyRequest<{ Querystring: UnitpineParams; }>) => {
      return unitSpineResource(req.query);
    }
  },
  {
    type: "GET",
    url: "/featureExpandDescribeText",
    handler: featureExpandDescribeText
  },
  {
    type: "GET",
    url: "/unitSearch",
    schema: {
      querystring: UnitSrarch
    },
    handler: (req: FastifyRequest<{ Querystring: UnitSrarch; }>) => {
      const { skill, raceFeature } = req.query;
      console.log(` /search ${new Date().toLocaleString()}:
 \x1b[32mskill      : \x1b[31m${skill.padEnd(40)}
 \x1b[32mraceFeature: \x1b[31m${raceFeature}\x1b[0m`);

      return unitSearch(raceFeature, skill);
    }
  }
];