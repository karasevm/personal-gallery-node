/** @jsxImportSource @emotion/react */
import {ButtonBase, ImageListItemBar, IconButton} from '@mui/material';
import {css} from '@emotion/react';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {type Image} from '../types';

const styles = {
  image: css({
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }),
  link: css({
    width: '100%',
    height: '100%',
    '&:hover': {
      opacity: '0.9',
    },
    '&:focus': {
      opacity: '0.9',
    },
  }),
  item: css({
    opacity: '0',
    transition: 'opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    width: '100%',
    height: '100%',
  }),
  fadeIn: css({
    opacity: '100',
    backgroundColor: '#fff',
  }),
  titleBar: css({
    background: 'rgba(0, 0, 0, 0)',
    width: '48px',
  }),
  icon: css({
    color: 'white',
    filter: 'drop-shadow(2px 4px 3px #222222)',
  }),
  container: css({
    width: '100%',
    height: '100%',
    backgroundColor: '#ebebeb',
  }),
};

function ImageThumbnail({image, onTileClick, onNotification}: {
  readonly image: Image;
  readonly onTileClick: (url: string) => void;
  readonly onNotification: (text: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const {t} = useTranslation();
  const copyToClipboard = async (stringToCopy: string) => {
    await navigator.clipboard.writeText(stringToCopy);
    onNotification(t('Copied link to clipboard'));
  };

  return (
    <div css={styles.container}>
      <div css={[styles.item, loaded ? styles.fadeIn : null]}>
        <ButtonBase disableTouchRipple css={styles.link}>
          <a
            href={image.url}
            css={styles.link}
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              onTileClick(image.url);
            }}
          >
            <picture>
              {image.thumbnails.map(thumb => (
                <source
                  key={encodeURI(thumb.url)}
                  srcSet={encodeURI(thumb.url)}
                  type={thumb.filetype}
                />
              ))}
              <img
                loading='lazy'
                css={styles.image}
                src={
                  image.thumbnails.find(
                    thumb => thumb.filetype === 'image/jpeg',
                  )?.url
                }
                alt=''
                onLoad={() => {
                  setLoaded(true);
                }}
              />
            </picture>
          </a>
        </ButtonBase>
        <ImageListItemBar
          position='top'
          actionIcon={(
            <IconButton
              css={styles.icon}
              size='large'
              onClick={() => {
                void copyToClipboard(
                  `${window.location.href.replace(/\/$/, '')}${image.url}`,
                );
              }}
            >
              {/* <FileCopyOutlinedIcon /> */}
              <span className='material-icons'>content_copy</span>
            </IconButton>
          )}
          actionPosition='left'
          css={styles.titleBar}
        />
      </div>
    </div>
  );
}

export default ImageThumbnail;
