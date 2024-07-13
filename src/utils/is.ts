/**
 * 判断下标的值是不是数组类型
 */
export function isTupleArray<T extends unknown[]>(data: any): data is T {
  return Array.isArray(data[0]);
}
