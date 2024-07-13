import type { Document } from "mongodb";

export type rangeTuple = [number, number];

export type Projection = Record<string, 0 | 1>;

export type QueryValue = {
  includes: string[];
  excludes: string[];
  find?: Document;
};

export type FindParam = number | string | Date;
