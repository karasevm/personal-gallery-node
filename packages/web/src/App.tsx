import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  makeStyles,
  Theme,
  createStyles,
  withWidth,
  WithWidth,
  Dialog,
  CircularProgress,
  IconButton,
  Snackbar,
  Grid,
  Typography,
} from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import * as imageService from './services/images';
import * as settingsService from './services/settings';
import * as loginService from './services/login';
import * as metaService from './services/meta';
import * as userService from './services/user';
import ImageGridListTile from './components/ImageGridList';
import {
  Config, Image, SortBy, SortOrder,
} from './types';
import PicturesAppBar from './components/PicturesAppBar';
import UploadDialog from './components/UploadDialog';
import ConfigurationDialog from './components/ConfiguarionDialog';
import LoginView from './components/LoginView';
import ConfirmationDialog from './components/ConfirmationDialog';
import CredentialChangeDialog from './components/CredentialChangeDialog';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100vh',
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
  },
  toolbarButton: {
    flexGrow: 1,
  },
  placeholderText: {
    textAlign: 'center',
    margin: theme.spacing(1),
    color: '#696969',
  },
  placeholderIconContainer: {
    textAlign: 'center',
    color: '#696969',
  },
  placeholderIcon: {
    fontSize: '96px',
    verticalAlign: '-25%',
  },
}));

function App(props: WithWidth) {
  const [modalImage, setModalImage] = useState('');
  const [modalVideo, setModalVideo] = useState('');
  const [imagesData, setImagesData] = useState<any>(undefined);
  const imagesPage = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [userSettings, setUserSettings] = useState<Config | undefined>(
    undefined,
  );
  const [dragOpen, setDragOpen] = useState(false);
  const [configurationDialogOpen, setConfigurationDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [credentialChangeDialogOpen, setCredentialChangeDialogOpen] = useState(
    false,
  );
  const [notification, setNotification] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | undefined>(
    undefined,
  );
  const [acceptedUploadFiletypes, setAcceptedUploadFiletypes] = useState([
    'image/webp',
    'image/avif',
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
  ]);
  const [setupFinished, setSetupFinished] = useState(true);
  const [apiKey, setApiKey] = useState<string | undefined>();

  const { width } = props;
  const { t } = useTranslation();

  const widthMap = {
    xs: 3, sm: 4, md: 5, lg: 6, xl: 6,
  };
  const cols = widthMap[width];
  const classes = useStyles();

  useEffect(() => {
    // imageService.getAll().then(result => setImagesData(result));
    metaService.getMeta().then((result) => {
      setAcceptedUploadFiletypes(result.accepted);
      setSetupFinished(result.setupFinished);
      setUserSettings(settingsService.getSettings());
      setUserLoggedIn(settingsService.getUserState());
    });
  }, []);
  const imageTileClickHandler = (url: string) => {
    if (/\.(mp4|webm)$/.test(url)) {
      setModalVideo(url);
    } else {
      setModalImage(url);
    }
  };

  const handleLogout = async (clientOnly: boolean = false) => {
    if (!clientOnly) {
      loginService.doLogout();
    }
    setUserLoggedIn(false);
    setDragOpen(false);
    setConfirmDialogOpen(false);
    setConfigurationDialogOpen(false);
    setCredentialChangeDialogOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    settingsService.setUserState(false);
  };

  const onDataNext = () => {
    const page = imagesPage.current;
    imageService
      .getPage(
        page,
        userSettings?.sortBy,
        userSettings?.sortOrder,
      )
      .then((result) => {
        if (result.length === 0) {
          setHasMore(false);
        } else {
          setImagesData((data: any) => ({ ...data, [page]: result }));
        }
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 401) {
          handleLogout(true);
          setNotification(t('Authorization error, please login'));
        } else {
          setNotification(t('Error getting image list from server'));
        }
        imagesPage.current -= 1;
      });
    imagesPage.current += 1;
  };

  const refreshData = () => {
    imagesPage.current = 0;
    setHasMore(true);
    setImagesData({});
  };

  const handleUpload = async (images: File[]) => {
    setDragOpen(false);
    const promises = images.map(async (image) => imageService.uploadImage(image));
    try {
      const combinedResult = await Promise.all(promises);
      if (combinedResult.length > 0) {
        setImagesData((data: { [key:number]: Image[] }) => {
          if (data === undefined || Object.keys(data).length === 0) {
            return { [-1]: combinedResult };
          }
          if (data[-1] === undefined || Object.keys(data[-1]).length === 0) {
            return { ...data, [-1]: [...combinedResult] };
          }
          return { ...data, [-1]: [...combinedResult, ...data[-1]] };
        });
      }
    } catch (e) {
      setNotification(t('Error uploading image'));
      // refreshData();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.items.length !== 0) {
      Array.from(e.clipboardData.items).forEach((item) => {
        if (acceptedUploadFiletypes.includes(item.type)) {
          const pasteAsFile = item.getAsFile();
          if (pasteAsFile !== null) {
            handleUpload([pasteAsFile]);
          }
        }
      });
    }
  };

  const handleSettingsChange = (sortBy: SortBy, sortOrder: SortOrder) => {
    setUserSettings({ ...userSettings, sortBy, sortOrder });
    setConfigurationDialogOpen(false);
    settingsService.saveSettings({ ...userSettings, sortBy, sortOrder });
    setNotification(t('Settings changed'));
    refreshData();
  };

  const handleLogin = async (username: string, password: string) => {
    const result = setupFinished
      ? await loginService.doLogin(username, password)
      : await loginService.doRegister(username, password);
    switch (result) {
      case 200:
        setUserLoggedIn(true);
        settingsService.setUserState(true);
        if (!setupFinished) {
          setSetupFinished(true);
        }
        break;
      case 401:
        setNotification(t('Icorrect username or password'));
        break;
      case 429:
        setNotification(t('Too many attempts, try again later'));
        break;
      default:
        setNotification(t('Unknown error occured, try again later'));
        break;
    }
  };

  const handleApiKeyChange = async () => {
    try {
      const key = await userService.getApiKey();
      await navigator.clipboard.writeText(key);
      setNotification(t('API token copied to clipboard'));
      setApiKey(key);
    } catch (e) {
      setNotification(t('Error getting API key'));
    }
  };

  const handleCredentialsChange = async (
    oldPassword: string,
    username: string,
    password: string,
  ) => {
    try {
      await userService.updateCredentials(oldPassword, username, password);
      handleLogout();
      setNotification(t('Please login with your new credentials'));
    } catch (e: any) {
      if (e.response.status === 401) {
        setNotification(t('Check your old password and try again'));
      }
    }
  };

  if (userSettings === undefined || userLoggedIn === undefined) {
    return (
      <Grid container justifyContent="center">
        <CircularProgress className={classes.loader} />
      </Grid>
    );
  }
  return (
    <div
      className={classes.root}
      onDragEnter={() => setDragOpen(true)}
      onPaste={handlePaste}
    >
      {userLoggedIn ? (
        <>
          <PicturesAppBar
            onUploadClick={() => setDragOpen(true)}
            onSettingsClick={() => setConfigurationDialogOpen(true)}
            onLogoutClick={handleLogout}
          />
          <Container>
            <InfiniteScroll
              loadMore={onDataNext}
              pageStart={-1}
              hasMore={hasMore}
              loader={(
                <Grid key="asdf" container justifyContent="center">
                  <CircularProgress className={classes.loader} />
                </Grid>
              )}
            >
              {typeof imagesData === 'object' && Object.keys(imagesData).length !== 0 ? (
                <ImageGridListTile
                  images={[...new Set(Object.keys(imagesData).sort((a:any, b:any) => a - b).reduce(
                    (r, k) => (r.concat(imagesData[k])),
                    [],
                  ))]}
                  cols={cols}
                  onTileClick={imageTileClickHandler}
                  onNotification={setNotification}
                />
              ) : (
                <Grid key="qwerty">
                  <div className={classes.placeholderIconContainer}>
                    <span className={`material-icons-outlined ${classes.placeholderIcon}`}>
                      insert_photo
                    </span>
                  </div>
                  <Typography className={classes.placeholderText}>
                    {t('Upload your first image')}
                  </Typography>
                </Grid>
              )}
            </InfiniteScroll>
          </Container>
        </>
      ) : (
        <LoginView onLogin={handleLogin} setupFinished={setupFinished} />
      )}

      <Dialog
        open={modalImage !== '' || modalVideo !== ''}
        onClose={() => {
          setModalImage('');
          setModalVideo('');
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        {modalImage !== '' ? (
          <img className={classes.dialogImage} src={modalImage} alt="" />
        ) : null}
        {modalVideo !== '' ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={classes.dialogImage}
            autoPlay
            controls
            src={modalVideo}
          />
        ) : null}
      </Dialog>
      <UploadDialog
        isOpen={dragOpen}
        onClose={() => setDragOpen(false)}
        onDrop={handleUpload}
        accept={acceptedUploadFiletypes}
      />
      <ConfigurationDialog
        open={configurationDialogOpen}
        onDialogClose={() => setConfigurationDialogOpen(false)}
        currentSettings={userSettings}
        onSave={handleSettingsChange}
        onApiKeyChange={() => setConfirmDialogOpen(true)}
        apiKey={apiKey}
        onCredentialsChange={() => setCredentialChangeDialogOpen(true)}
      />
      <ConfirmationDialog
        header={t('Get new API key?')}
        content={t('This will invalidate your previous API key, continue?')}
        open={confirmDialogOpen}
        onConfirm={() => {
          handleApiKeyChange();
          setConfirmDialogOpen(false);
        }}
        onCancel={() => setConfirmDialogOpen(false)}
      />
      <CredentialChangeDialog
        open={credentialChangeDialogOpen}
        onDialogClose={() => setCredentialChangeDialogOpen(false)}
        onCredentialsUpdate={handleCredentialsChange}
        onNotification={(text) => setNotification(text)}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={notification.length !== 0}
        autoHideDuration={4000}
        onClose={() => setNotification('')}
        message={notification}
        action={(
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setNotification('')}
            >
              <span className="material-icons">close</span>
            </IconButton>
          </>
        )}
      />
    </div>
  );
}

export default withWidth()(App);
