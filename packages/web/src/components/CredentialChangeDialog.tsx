import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => createStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const CredentialChangeDialog = ({
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
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const handleSubmit = async () => {
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
          className={classes.form}
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
            className={classes.margin}
          />
          <TextField
            label={t('Password')}
            fullWidth
            type="password"
            autoComplete="new-password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.margin}
          />
          <TextField
            label={t('Old password')}
            fullWidth
            type="password"
            autoComplete="current-password"
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={classes.margin}
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
};

export default CredentialChangeDialog;
