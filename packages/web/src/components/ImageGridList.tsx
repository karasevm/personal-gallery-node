import React from 'react';
import { GridList, GridListTile } from '@material-ui/core';
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
  <GridList cellHeight={160} cols={cols}>
    {images.map((image) => (
      <GridListTile key={image.filename}>
        <ImageThumbnail
          image={image}
          onTileClick={onTileClick}
          onNotification={onNotification}
        />
      </GridListTile>
    ))}
  </GridList>
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
