import { dbColl } from "@/mongodb";
import type { UnitSkin, UnitXData } from "./types";
import type { AbilitiesCharacter, AbilitiesEnemy, AbilitiesBeastGod, AbilitiesToken, UnitAbilities } from "./types";
import { objectArrayToObject } from "@/utils/dataConversion";

export const unitAbilities = async (unitAbilities: UnitAbilities) => {
  const { tribeId, picture, unitType } = unitAbilities;
  const picturebookAndTribeData = await getPicturebookAndTribe(tribeId, picture);
  const unitAbilitiesData = await unitCategory[unitType](unitAbilities);

  return Object.assign(picturebookAndTribeData, unitAbilitiesData);
};

const unitCategory = {
  character: async (query: AbilitiesCharacter) => {
    const { id, skillIds } = query;

    const uniqueWeapon = await getUniqueWeapon(id);
    const raceFeature = await dbColl("ability").findSingle(id);
    const skill = await getSkill(skillIds);
    const skin = await getSkin(id);

    return { raceFeature, skill, skin, uniqueWeapon };
  },
  enemy: async (query: AbilitiesEnemy) => {
    const { id, helpId, abilityIdList } = query;
    const associationIds = await dbColl("enemyAssociationId").findSingle<{ id: number, idList: number[]; }>(id, "idList");
    const enemyEntranceMaps = await dbColl("enemyEntranceMaps").findSingle<{ id: number; list: any[]; }>(associationIds?.id || id);
    const abilityList = await getAbilityList(abilityIdList);
    const help = await dbColl("helpWindow").findSingle(helpId);

    return { associationIds: associationIds?.idList, enemyEntranceMaps: enemyEntranceMaps?.list, abilityList, help };
  },
  beastGod: async (query: AbilitiesBeastGod) => {
    const { id, abilityIdList, skillIds } = query;
    const skill = await getSkill(skillIds);
    const abilityList = await getAbilityList(abilityIdList);
    const bomData = await dbColl("bomData").findSingle(id, "summonIndex");

    return { abilityList, skill, bomData };
  },
  token: async (params: AbilitiesToken) => {
    const { id, abilityIdList = [], skillIds } = params;
    abilityIdList.unshift(id);

    const skill = await getSkill(skillIds);
    const abilityList = await getAbilityList(abilityIdList);

    return { abilityList, skill };
  },
};

const getSkill = async (skillIds: number[]) => {
  if (skillIds[0]) {
    return await dbColl("skill").findId(skillIds);
  }
  return [];
};

const getAbilityList = async (abilityIdList: number[]) => {
  return await dbColl("ability").findId(abilityIdList);
};

const getUniqueWeapon = async (card_id: number) => {
  const uniqueWeaponValue = await dbColl("uniqueWeapon").findId<{ uw_id: number; }>(card_id, "card_id");
  const uniqueWeaponAbility = uniqueWeaponValue ? {
    ability: await dbColl("uniqueWeaponAbility").findSingle(uniqueWeaponValue[0].uw_id),
    list: uniqueWeaponValue
  } : null;

  return uniqueWeaponAbility;
};

const getSkin = async (id: number) => {
  const skins: UnitSkin[] = await dbColl("unitSkin").findId(id, "unit_card_id");

  if (!skins[0]) {
    const resource_id = +String(id).padStart(5, "1000");
    skins.push({
      "unit_card_id": id,
      "skin_id": 0,
      "resource_id": resource_id,
      "is_x": 1,
      "name": "通常",
      "icon": resource_id,
      "description": "null",
      "profile": ""
    });
  }

  const newSkin = [];
  const UnitxData = objectArrayToObject(await dbColl("x").findId<UnitXData>(skins.map(p => p.resource_id)));
  for (const item of skins) {
    item.icon = item.resource_id;
    newSkin.push(item);

    const x = UnitxData[item.resource_id];
    if (x) {
      const value_x = JSON.parse(JSON.stringify(item));
      const id = +x.data[1];
      value_x.resource_id = id;
      value_x.icon = x.icon ? id : item.resource_id;
      value_x.resource_key = x.xKey;
      value_x.name += "_x";
      newSkin.push(value_x);
    }
  }

  return newSkin;
};

const getPicturebookAndTribe = async (tribeId: number, picture: number) => {
  const tribe = await dbColl("tribe").findSingle(tribeId) ?? {};
  const picturebook = await dbColl("picturebook").findSingle(picture);
  return { tribe, picturebook };
};