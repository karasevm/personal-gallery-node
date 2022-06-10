/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import {
  AppBar,
  Button,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function PicturesAppBar({ onUploadClick, onSettingsClick, onLogoutClick }:
{
  onUploadClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}) {
  const trigger = useScrollTrigger();
  const styles = {
    toolbarTitle: css({
      flexGrow: 1,
      textAlign: 'left',
    }),
    toolbarButton: css({
      flexGrow: 1,
    }),
  };
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
            <Typography variant="h6" css={styles.toolbarTitle}>
              {t('Pictures')}
            </Typography>
            <IconButton color="inherit" aria-label="upload" onClick={onUploadClick} size="large">
              <span className="material-icons">cloud_upload</span>
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="settings"
              onClick={onSettingsClick}
              size="large"
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
}

export default PicturesAppBar;
