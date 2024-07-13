import type { Collection, Filter, Document } from "mongodb";
import type { Projection, rangeTuple, QueryValue, FindParam } from "./types";
import { isTupleArray } from "@/utils/is";
import type { CollIndex } from "../types";

class CollFind<F extends CollIndex[keyof CollIndex]> {
  constructor(private coll: Collection, private projection: Projection = { "_id": 0 }) { }
  /**
  * 范围查询
  * @param range 元组
  * ``` ts
  * [1, 10] 查询大于等于1,小于10的文档
  * ```
  * @param field 查询字段
  * @param filterField 筛选字段
  */
  async findRange<V extends Document = Document>(range: rangeTuple | rangeTuple[], field: F = "id" as F, filterField?: Projection): Promise<V[]> {
    const filter = this.#mergeProjection(filterField);
    return this.coll.find(CollFind.getFindRange(field, range)).project<V>(filter).toArray();
  };
  /**
  * @param ids 
  * ```
  * value 查询单个id
  * [value1,value2] 查询多个id
  * ```
  * @param field 查询字段
  * @param filterField 筛选字段
  */
  async findId<V extends Document = Document>
    (id: FindParam | FindParam[], field: F = "id" as F, filterField?: Projection): Promise<V[]> {
    const filter = this.#mergeProjection(filterField);
    const ids = Array.isArray(id) ? id : [id];

    if (!ids.length) return [];
    return this.coll.find({ [field]: { $in: ids } }).project<V>(filter).toArray();
    // return this.coll.find({ [field]: { $in: ids } }).project(filter).toArray() as any;
  };

  async findSingle<V extends Document = Document>(id: FindParam, field: F = "id" as F, filterField?: Projection): Promise<V | null> {
    const filter = this.#mergeProjection(filterField);
    return this.coll.findOne<V>({ [field]: id }, { projection: filter });
  }

  async regexMatch<V extends Document = Document>(query: Unfold<QueryValue>, field: string, filterField?: Projection): Promise<V[]> {
    const queryObj: Document = {};

    if (query.includes.length) {
      queryObj["$all"] = query.includes.map(word => ({
        $elemMatch: { $regex: word }
      }));
    }
    if (query.excludes.length) {
      queryObj["$not"] = { $elemMatch: { $regex: `(${query.excludes.join("|")})` } };
    }
    if (!Object.keys(queryObj).length) return [];

    return this.aggregate([
      {
        $match: {
          ...query.find || {},
          [field]: queryObj
        }
      }
    ], filterField);
  };

  find<V extends Document = Document>(find: Filter<Document>, filterField?: Projection): Promise<V[]> {
    const filter = this.#mergeProjection(filterField);
    return this.coll.find(find).project<V>(filter).toArray();
  };

  findOne<V extends Document = Document>(find: Filter<Document>, filterField?: Projection): Promise<V | null> {
    const filter = this.#mergeProjection(filterField);
    return this.coll.findOne<V>(find, { projection: filter });
  };

  aggregate<V extends Document = Document>(find: Document[], filterField?: Projection): Promise<V[]> {
    const filter = this.#mergeProjection(filterField);
    find.push({ $project: filter });
    return this.coll.aggregate<V>(find).toArray();
  };

  #mergeProjection(v: Projection = {}): Projection {
    return Object.assign(v, this.projection);
  }

  static getRange = (field: string, range: rangeTuple) => {
    return { [field]: { $gte: range[0], $lt: range[1] } };
  };

  static getFindRange = (field: string, range: rangeTuple | rangeTuple[]) => {
    if (isTupleArray<rangeTuple[]>(range)) {
      return { $or: [range.map(p => CollFind.getRange(field, p))] };
    }

    return CollFind.getRange(field, range);
  };
}

export default CollFind;