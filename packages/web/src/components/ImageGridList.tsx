import React from 'react';
import { ImageList, ImageListItem } from '@material-ui/core';
import { Image } from '../types';
import ImageThumbnail from './ImageThumbnail';

const ImageGridListTile = ({
  images,
  cols,
  onTileClick,
  onNotification,
}:{
  images: Image[];
  cols: number;
  onTileClick: (url: string) => void;
  onNotification: (text: string) => void;
}) => (
  <ImageList rowHeight={160} cols={cols}>
    {images.map((image) => (
      <ImageListItem key={image.filename}>
        <ImageThumbnail
          image={image}
          onTileClick={onTileClick}
          onNotification={onNotification}
        />
      </ImageListItem>
    ))}
  </ImageList>
);

export default React.memo(ImageGridListTile, (prevProps, nextProps) => {
  if (
    prevProps.images.length === nextProps.images.length
    && prevProps.cols === nextProps.cols
  ) {
    return true;
  }
  return false;
});
