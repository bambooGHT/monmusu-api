import { LevelDetailedData, QuestCategory, QuestData } from "./types";
import { getQuestCategory } from "./questCategory";
import type { FastifyRequest } from "fastify";
import { levelDetailedData, questData } from "./questData";
import type { RouteType } from "../types";

export const routes: RouteType[] = [
  {
    type: "GET",
    url: "/questCategory/:category",
    schema: {
      params: QuestCategory
    },
    handler: (req: FastifyRequest<{ Params: QuestCategory; }>) => {
      return getQuestCategory(req.params.category);
    }
  },
  {
    type: "GET",
    url: "/questData",
    schema: {
      querystring: QuestData
    },
    handler: (req: FastifyRequest<{ Querystring: { id: number; }; }>, res) => {
      return questData(req.query.id).catch(p => {
        res.status(404).send(new Error(`quest with id ${req.query.id} does not exist`));
      });
    }
  },
  {
    type: "GET",
    url: "/levelDetailedData",
    schema: {
      querystring: LevelDetailedData
    },
    handler: (req: FastifyRequest<{ Querystring: LevelDetailedData; }>) => {
      return levelDetailedData(req.query);
    }
  }
];