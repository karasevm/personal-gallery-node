import {
  AppBar,
  Button,
  createStyles,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => createStyles({
  margin: {
    margin: theme.spacing(1),
  },
  header: {
    textAlign: 'center',
    fontWeight: 300,
  },
}));

const LoginView = (
  { onLogin, setupFinished }:
  {
    onLogin: (username: string, password: string) => void;
    setupFinished: boolean;
  },
) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{t('Pictures')}</Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '80vh' }}
      >
        <Grid item xs={10} md={4}>
          <Typography variant="h3" className={classes.header}>
            {setupFinished ? t('Login') : t('Register')}
          </Typography>
          <form
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              onLogin(username, password);
            }}
          >
            <TextField
              id="outlined-username-input"
              label={t('Username')}
              fullWidth
              type="text"
              autoComplete={setupFinished ? 'current-username' : 'new-username'}
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={classes.margin}
            />
            <TextField
              id="outlined-password-input"
              label={t('Password')}
              fullWidth
              type="password"
              autoComplete={setupFinished ? 'current-password' : 'new-password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.margin}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.margin}
              fullWidth
            >
              {setupFinished ? t('Login') : t('Register')}
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default LoginView;
