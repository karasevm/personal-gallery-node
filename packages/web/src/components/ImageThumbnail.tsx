import { ButtonBase, GridListTileBar, IconButton } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from '../types';

const useStyles = makeStyles(() => createStyles({
  image: {
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  link: {
    width: '100%',
    height: '100%',
    '&:hover': {
      opacity: '0.9',
    },
    '&:focus': {
      opacity: '0.9',
    },
  },
  item: {
    opacity: '0',
    transition: 'opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    width: '100%',
    height: '100%',
  },
  fadeIn: {
    opacity: '100',
    backgroundColor: '#fff',
  },
  titleBar: {
    background: 'rgba(0, 0, 0, 0)',
    width: '48px',
  },
  icon: {
    color: 'white',
    filter: 'drop-shadow(2px 4px 3px #222222)',
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ebebeb',
  },
}));

const ImageThumbnail = ({ image, onTileClick, onNotification }:{
  image: Image;
  onTileClick: (url: string) => void;
  onNotification: (text: string) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const copyToClipboard = async (stringToCopy: string) => {
    await navigator.clipboard.writeText(stringToCopy);
    onNotification(t('Copied link to clipboard'));
  };
  return (
    <div className={classes.container}>
      <div className={`${classes.item} ${loaded ? classes.fadeIn : null}`}>
        <ButtonBase disableTouchRipple className={classes.link} tabIndex="-1">
          <a
            href={image.url}
            className={classes.link}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onTileClick(image.url);
            }}
          >
            <picture>
              {image.thumbnails.map((thumb) => (
                <source
                  key={encodeURI(thumb.url)}
                  srcSet={encodeURI(thumb.url)}
                  type={thumb.filetype}
                />
              ))}
              <img
                loading="lazy"
                className={classes.image}
                src={
                  image.thumbnails.filter(
                    (thumb) => thumb.filetype === 'image/jpeg',
                  )[0].url
                }
                alt=""
                onLoad={() => setLoaded(true)}
              />
            </picture>
          </a>
        </ButtonBase>
        <GridListTileBar
          titlePosition="top"
          actionIcon={(
            <IconButton
              className={classes.icon}
              onClick={() => {
                copyToClipboard(
                  `${window.location.href.replace(/\/$/, '')}${image.url}`,
                );
              }}
            >
              {/* <FileCopyOutlinedIcon /> */}
              <span className="material-icons">content_copy</span>
            </IconButton>
          )}
          actionPosition="left"
          className={classes.titleBar}
        />
      </div>
    </div>
  );
};

export default ImageThumbnail;
