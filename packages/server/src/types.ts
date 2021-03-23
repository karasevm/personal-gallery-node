export interface Image {
  filename: string;
  imagebuffer: Buffer;
  filetype: string;
}

export interface ImageDbEntry {
  id: number;
  filename: string;
  added: number;
}

export interface ThumbnailMeta {
  filetype: string;
  url: string;
}

export enum SortBy {
  Name = 'filename',
  Date = 'added',
}

export enum SortOrder {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export interface Config {
  sortBy: SortBy;
  sortOrder: SortOrder;
}
