import type { MongoClientOptions } from "mongodb";
export type NewMongo = Unfold<{
  url: string;
  /** 数据库名 */
  dbName: string;
  options?: MongoClientOptions;
}>;
export type CollIndex = {
  ability: "id",
  unit: "id" | "classId",
  unitSkin: "resource_id" | "unit_card_id",
  unitRarity: string,
  unitLevelExp: string,
  unitEmoteData: "id",
  soundVoice: string,
  x: "id",
  enemy: "id",
  bomcard: "id",
  bomData: "id" | "summonIndex",
  job: "id" | "equipmentPattern",
  tribe: "id",
  skill: "id",
  attach: string,
  picturebook: "id",
  itemTemplate: "item_id",
  helpWindow: "id",
  gallery: "id",
  equipment: string,
  equipmentPattern: string,
  announceImage: "start_date",
  battleEvent: "id",
  mainQuestSynopsis: string,
  quest: "id" | "chapter" | "category",
  mission: "target",
  eventKillRewards: "reward_table_id",
  eventStarRatingRewards: "event_id",
  shop: "id" | "tab_category",
  wallet: string,
  uniqueWeapon: "uw_id" | "card_id",
  uniqueWeaponAbility: "id",
  battleMember: "id",
  battleNPC: "id",
  questOther: "id",
  levelEnemyBuffMenu: "quest_id",
  featureExpandDescribeText: string,
  weatherEffect: string,
  bonusPass: "end_dt",
  bonusPassTrackReward: "pass_id",
  eventSealedChara: "event_id",
  eventSealedCharaMods: "event_id",
  srcAnnounceimage: "id",
  srcGallery: string,
  srcMapGround: "id",
  srcUnitSpine: "id",
  srcUnitvoices: "id",
  tokenData: string,
  eventList: "chapter",
  bossList: "id",
  enemyAssociationId: "idList",
  dungeonList: string,
  dungeonAttachRewards: "id",
  attachObtainWays: string,
  enemyEntranceMaps: "id",
  mapData: "id",
  advStoryMain: "name",
  advStoryConfig: string,
};