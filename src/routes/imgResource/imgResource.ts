import type { Gallery, GallerySrc, AnnounceType } from "./types";
import { RouteHandler } from "../types";
import { dbColl } from "@/mongodb";

const galleryRandom: RouteHandler = async () => {
  const [gallerySrc] = await dbColl("srcGallery").aggregate<GallerySrc>([
    { $match: { id: { $lt: 500 } } },
    { $sample: { size: 1 } },
  ]);;
  const galleryData = await dbColl("gallery").findSingle<Gallery>(gallerySrc.id);

  return { ...gallerySrc, ...galleryData };
};

const gallery = async () => {
  const imgList = await dbColl("srcGallery").find({});
  const galleryData = await dbColl("gallery").find<Gallery>({});
  const result = galleryData.reduce((list: Gallery[][], value, index) => {
    if (value.sort_order & 1) {
      list[list.length] = [Object.assign(value, imgList[index])];
    } else {
      list[list.length - 1].push(Object.assign(value, imgList[index]));
    }
    return list;
  }, []);

  return { list: result, total: galleryData.length };
};

const announceImages = async () => {
  const announceImagesData = await dbColl("announceImage").find<AnnounceType>({ "start_date": { $gt: new Date("2024.5.10") } });
  const src = await dbColl("srcAnnounceimage").findId(announceImagesData.map((p) => p.id));

  src.forEach((p, i) => {
    announceImagesData[i].src = p.src;
  });

  return announceImagesData;
};

export const routes = [
  {
    type: "GET",
    url: "/galleryRandom",
    handler: galleryRandom
  },
  {
    type: "GET",
    url: "/gallery",
    handler: gallery,
  },
  {
    type: "GET",
    url: "/announceImages",
    handler: announceImages
  }
];