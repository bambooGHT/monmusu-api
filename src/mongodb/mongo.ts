import { MongoClient } from "mongodb";
import type { Db, Collection, Document } from "mongodb";
import type { NewMongo } from "./types";

class Mongo {
  private client!: MongoClient;
  db!: Db;
  constructor({ url, dbName, options }: NewMongo) {
    const client = new MongoClient(url, options);
    this.db = client.db(dbName);
    this.client = client;
  }
  /** 获取集合 */
  getColl<T extends Document>(collName: string): Collection<T> {
    return this.db.collection<T>(collName);
  }
  async close() {
    console.log("關閉連接");
    await this.client.close();
  }
}

export default Mongo;