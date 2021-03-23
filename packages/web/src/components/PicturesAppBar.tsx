import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import {
  AppBar,
  Button,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  titleBar: {
    background:
        'linear-gradient(to bottom, rgba(0,0,0,0) 0%, '
        + 'rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)',
    transition: 'background 2s ease-out',
    '&:hover': {
      background:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0%, '
          + 'rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)',
    },
  },
  icon: {
    color: 'white',
    filter: 'drop-shadow(2px 4px 3px #222222)',
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      opacity: '0.9',
    },
  },
  dialogImage: {
    maxHeight: '80vh',
  },
  loader: {
    margin: '1rem',
  },
  toolbarTitle: {
    flexGrow: 1,
    textAlign: 'left',
  },
  toolbarButton: {
    flexGrow: 1,
  },
}));

const PicturesAppBar = (
  { onUploadClick, onSettingsClick, onLogoutClick }:
  {
    onUploadClick: () => void;
    onSettingsClick: () => void;
    onLogoutClick: () => void;
  },
) => {
  const classes = useStyles();
  const trigger = useScrollTrigger();
  const { t } = useTranslation();
  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar>
            {/* <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onDrawer}
            >
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" className={classes.toolbarTitle}>
              {t('Pictures')}
            </Typography>
            <IconButton
              color="inherit"
              aria-label="upload"
              onClick={onUploadClick}
            >
              <span className="material-icons">cloud_upload</span>
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="settings"
              onClick={onSettingsClick}
            >
              <span className="material-icons">settings</span>
            </IconButton>
            <Button color="inherit" onClick={() => onLogoutClick()}>
              {t('Logout')}
            </Button>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  );
};

export default PicturesAppBar;
