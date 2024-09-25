/** @jsxImportSource @emotion/react */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  type Theme,
} from '@mui/material';
import {useTheme} from '@mui/styles';
import {css} from '@emotion/react';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

function CredentialChangeDialog({
  isOpen: open, onDialogClose, onCredentialsUpdate, onNotification,
}: {
  readonly isOpen: boolean;
  readonly onDialogClose: () => void;
  readonly onCredentialsUpdate: (
    oldPassword: string,
    username: string,
    password: string
  ) => void;
  readonly onNotification: (text: string) => void;
}) {
  const {t} = useTranslation();
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
    <Dialog open={open} aria-labelledby='dialog-title' onClose={onDialogClose}>
      <DialogTitle id='dialog-title'>{t('Update user data')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('enter_new_username')}</DialogContentText>
        <form
          css={styles.form}
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            fullWidth
            id='outlined-username-input'
            label={t('Username')}
            type='text'
            autoComplete='new-username'
            variant='outlined'
            value={username}
            css={styles.margin}
            onChange={event => {
              setUsername(event.target.value);
            }}
          />
          <TextField
            fullWidth
            label={t('Password')}
            type='password'
            autoComplete='new-password'
            variant='outlined'
            value={password}
            css={styles.margin}
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
          <TextField
            fullWidth
            label={t('Old password')}
            type='password'
            autoComplete='current-password'
            variant='outlined'
            value={oldPassword}
            css={styles.margin}
            onChange={event => {
              setOldPassword(event.target.value);
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleSubmit}>
          {t('Save')}
        </Button>
        <Button color='primary' onClick={onDialogClose}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CredentialChangeDialog;
