/** @jsxImportSource @emotion/react */
import React from 'react';
import {css} from '@emotion/react';
import {ImageList, ImageListItem} from '@mui/material';
import {type Image} from '../types';
import ImageThumbnail from './ImageThumbnail';

function ImageGridListTile({
  images,
  cols,
  onTileClick,
  onNotification,
}: {
  readonly images: Image[];
  readonly cols: number;
  readonly onTileClick: (url: string) => void;
  readonly onNotification: (text: string) => void;
}) {
  return (
    <ImageList css={css({margin: 0, overflowY: 'hidden'})} rowHeight={160} cols={cols}>
      {images.map(image => (
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
}

export default React.memo(ImageGridListTile, (previousProperties, nextProperties) => {
  if (
    previousProperties.images.length === nextProperties.images.length
    && previousProperties.cols === nextProperties.cols
  ) {
    return true;
  }

  return false;
});
