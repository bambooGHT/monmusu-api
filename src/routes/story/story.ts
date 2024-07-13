import { dbColl } from "@/mongodb";
import type { RouteType } from "../types";

export const routes: RouteType[] = [
  {
    type: "GET",
    url: "/advStorySettingData",
    async handler() {
      return (await dbColl("advStoryConfig").findOne({}))!.data;
    }
  }
];