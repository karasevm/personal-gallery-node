/** @jsxImportSource @emotion/react */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Theme,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function CredentialChangeDialog({
  open, onDialogClose, onCredentialsUpdate, onNotification,
}: {
  open: boolean;
  onDialogClose: () => void;
  onCredentialsUpdate: (
    oldPassword: string,
    username: string,
    password: string
  ) => void;
  onNotification: (text: string) => void;
}) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const theme: Theme = useTheme();
  const styles = {
    form: css({
      display: 'flex',
      flexDirection: 'column',
    }),
    margin: css({
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }),
  };

  const handleSubmit = () => {
    if (username === '' && password === '') {
      onNotification(t('At least one field must be filled'));
      return;
    }
    onCredentialsUpdate(oldPassword, username, password);
  };
  return (
    <Dialog onClose={onDialogClose} open={open} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{t('Update user data')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('enter_new_username')}</DialogContentText>
        <form
          css={styles.form}
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            id="outlined-username-input"
            label={t('Username')}
            fullWidth
            type="text"
            autoComplete="new-username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            css={styles.margin}
          />
          <TextField
            label={t('Password')}
            fullWidth
            type="password"
            autoComplete="new-password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            css={styles.margin}
          />
          <TextField
            label={t('Old password')}
            fullWidth
            type="password"
            autoComplete="current-password"
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            css={styles.margin}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSubmit}>
          {t('Save')}
        </Button>
        <Button color="primary" onClick={onDialogClose}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CredentialChangeDialog;
