/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'; import {
  AppBar, Button, Grid, TextField, Theme, Toolbar, Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';

function LoginView({ onLogin, setupFinished }:
{
  onLogin: (username: string, password: string) => void;
  setupFinished: boolean;
}) {
  const { t } = useTranslation();
  const theme: Theme = useTheme();
  const styles = {
    margin: css({
      margin: theme.spacing(1),
    }),
    header: css({
      textAlign: 'center',
      fontWeight: 300,
    }),
  };
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
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '80vh' }}
      >
        <Grid item xs={8} md={6}>
          <Typography variant="h3" css={styles.header}>
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
              css={styles.margin}
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
              css={styles.margin}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              css={styles.margin}
              fullWidth
            >
              {setupFinished ? t('Login') : t('Register')}
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoginView;
