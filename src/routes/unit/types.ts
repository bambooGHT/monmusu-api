import { Type, type Static } from "@sinclair/typebox";

export const UnitCategory = Type.Union([
  Type.Literal('character'),
  Type.Literal('token'),
  Type.Literal('beastGod'),
  Type.Literal('enemy'),
]);

export type UnitCategory = Static<typeof UnitCategory>;

export const UnitAbilities = Type.Object({
  id: Type.Number(),
  unitType: UnitCategory,
  tribeId: Type.Number(),
  picture: Type.Number(),
  abilityIdList: Type.Optional(Type.Array(Type.Number())),
  skillIds: Type.Optional(Type.Array(Type.Number())),
  helpId: Type.Optional(Type.Number()),
});

export type UnitAbilities = Required<Static<typeof UnitAbilities>>;

export type AbilitiesCharacter = Pick<UnitAbilities, "id" | "skillIds">;
export type AbilitiesEnemy = Pick<UnitAbilities, "id" | "abilityIdList" | "helpId">;
export type AbilitiesBeastGod = AbilitiesCharacter & Pick<UnitAbilities, "abilityIdList">;
export type AbilitiesToken = AbilitiesBeastGod;

export const UnitVoiceId = Type.Number();
export const UnitpineParams = Type.Object({
  id: Type.String(),
  key: Type.Optional(Type.String()),
});

export type UnitpineParams = Static<typeof UnitpineParams>;

export type UnitSkin = {
  unit_card_id: number;
  skin_id: number;
  resource_id: number;
  is_x: number;
  name: string;
  description: string;
  profile: string;
  icon: number;
};

export type UnitXData = { data: string[]; icon: boolean; xKey?: string; };

export const UnitSrarch = Type.Object({
  skill: Type.String(),
  raceFeature: Type.String()
});

export type UnitSrarch = Static<typeof UnitSrarch>;