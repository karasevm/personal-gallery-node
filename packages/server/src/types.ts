export type Image = {
  filename: string;
  imagebuffer: Uint8Array;
  filetype: string;
};

export type ImageDatabaseEntry = {
  id: number;
  filename: string;
  added: number;
};

export type ThumbnailMeta = {
  filetype: string;
  url: string;
};

export enum SortBy {
  Name = 'filename',
  Date = 'added',
}

export enum SortOrder {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export type Config = {
  sortBy: SortBy;
  sortOrder: SortOrder;
};
