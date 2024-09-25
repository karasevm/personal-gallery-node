export type Image = {
  url: string;
  filename: string;
  thumbnails: Thumbnail[];
};

export type Thumbnail = {
  url: string;
  filetype: string;
};

export type ImageTile = {
  thumbnails: Thumbnail[];
  url: string;
  filename: string;
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

export type Meta = {
  accepted: string[];
  setupFinished: boolean;
};
