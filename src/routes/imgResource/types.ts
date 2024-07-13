export type GallerySrc = {
  id: number,
  src: string;
  base64: string;
};

export type Gallery = {
  id: number;
  date: string;
  header_title: string;
  title: string;
  sort_order: number;
};

export type AnnounceType = {
  id: number,
  src: string;
  start_date: number,
  end_date: number;
};
