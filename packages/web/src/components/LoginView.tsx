/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
  AppBar,
  Button,
  Grid,
  TextField,
  type Theme,
  Toolbar,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

function LoginView({
  onLogin,
  isSetupFinished: setupFinished
}: {
  readonly onLogin: (username: string, password: string) => void;
  readonly isSetupFinished: boolean;
}) {
  const { t } = useTranslation();
  const theme: Theme = useTheme();
  const styles = {
    margin: css({
      margin: theme.spacing(1)
    }),
    header: css({
      textAlign: 'center',
      fontWeight: 300
    })
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
        sx={{alignItems: 'center', justifyContent:'center'}}
        style={{ minHeight: '80vh' }}
      >
        <Grid size={{ xs: 8, md: 6 }}>
          <Typography variant="h3" css={styles.header}>
            {setupFinished ? t('Login') : t('Register')}
          </Typography>
          <form
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              onLogin(username, password);
            }}
          >
            <TextField
              fullWidth
              id="outlined-username-input"
              label={t('Username')}
              type="text"
              autoComplete={setupFinished ? 'current-username' : 'new-username'}
              variant="outlined"
              value={username}
              css={styles.margin}
              onChange={event => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              fullWidth
              id="outlined-password-input"
              label={t('Password')}
              type="password"
              autoComplete={setupFinished ? 'current-password' : 'new-password'}
              variant="outlined"
              value={password}
              css={styles.margin}
              onChange={event => {
                setPassword(event.target.value);
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              css={styles.margin}
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
