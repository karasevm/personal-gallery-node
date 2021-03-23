export interface Image {
  url: string;
  filename: string;
  thumbnails: Thumbnail[];
}

export interface Thumbnail {
  url: string;
  filetype: string;
}

export interface ImageTile {
  thumbnails: Thumbnail[];
  url: string;
  filename: string;
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

export interface Meta {
  accepted: string[];
  setupFinished: boolean;
}
