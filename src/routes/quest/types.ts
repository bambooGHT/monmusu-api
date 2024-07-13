import { Type, type Static } from "@sinclair/typebox";
import type { QuestRewards } from "./enums";

export const QuestCategory = Type.Object({
  category: Type.Union([
    Type.Literal('eventList'),
    Type.Literal('main'),
    Type.Literal('boss'),
    Type.Literal('other'),
    Type.Literal('dungeon'),
  ]),
});

export type QuestCategory = Static<typeof QuestCategory>;

export const QuestData = Type.Object({
  id: Type.Number()
});

export const LevelDetailedData = Type.Object({
  id: Type.Number(),
  battleMemberId: Type.Optional(Type.Number()),
  battleNPCId: Type.Optional(Type.Number()),
  attachTableId: Type.Optional(Type.String()),
});

export type LevelDetailedData = Static<typeof LevelDetailedData>;

export type Chapter = {
  id: number;
  chapter: number | [number, number];
  contain_chapters?: number[];
  name: string;
  text: string;
  src?: string;
  open_time?: string;
  close_time?: string;
  shop_id?: number;
  shop_id2?: number;
  event_dataTable_id?: number;
};

export type ChapterBoss = {
  id: number;
  name: string;
  src: string;
  text: string;
  shop_id: number;
  questRangeIdTuple: [number, number];
  openTime: string;
  closeTime: string;
};

export type ChapterEvent = {
  id: number;
  event_type: number;
  name: string;
  chapter: number;
  text: string;
  src: string;
  x_src: string;
  banner_src: string;
  banner_src2: string;
  contain_chapters: number[];
  shop_id: number;
  shop_id2: number;
  open_time: string;
  close_time: string;
  event_dataTable_id: number;
};

export type QuestRewardsTypes = {
  type: QuestRewards;
  ids: number[];
}[];

export type MapDeployEntries = {
  /** 条目id */
  id: number;
  /** 开始时间 */
  startTime: number;
  nextEntryId: number;
  /** 自动开始事件 */
  auto: number;
  events: DeployEntries_Event[];
  deploys: DeployEntries_Deploy[];
  callCount: number;
};

export type DeployEntries_Deploy = {
  /** id */
  id: number;
  /** 时间 */
  timing: number;
  /** 路由 */
  routeId: number;
  /** enemyId */
  appId: number;
  /** 是否需要销毁 */
  noNeedToDestroyFlag: number;
  /** 预兆类型 */
  omenType: number;
  /** 是否为boss */
  bossFlag: number;
  /** 动画 */
  appAnimFlag: number;
  /** 是否无敌 */
  appInvincibleFlag: number;
};

export type DeployEntries_Event = {
  /** id */
  id: number;
  /** 事件id */
  eventId: number;
  /** 开始时间 */
  timing: number;
  /** 标志 */
  justFlag: number;
  /** 需要开始 */
  requiredStart: number;
};

export type BattleEvent = {
  id: number;
  name: string;
  text: string;
  talentList: {
    talentId: number;
    timing: number;
    range: number;
    param: any[];
    maxParam: any[];
    triggerData: any[];
    activeData: any[];
  }[];
};