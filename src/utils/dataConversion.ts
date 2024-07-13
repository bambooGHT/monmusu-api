/**
 * 对象数组转对象
 * @param data 对象数组
 * @param id 当键的字段
 * @param isRemoveId 是否删除键字段
 */
export const objectArrayToObject = <T extends Record<string, any>>(data: T[], id: keyof T = "id", isRemoveId?: boolean): { [index: string]: T; } => {
  return data.reduce((result: { [index: string]: T; }, value) => {
    if (value[id]) {
      result[value[id]] = value;
      if (isRemoveId) {
        delete value[id];
      }
    }
    return result;
  }, {});
};
