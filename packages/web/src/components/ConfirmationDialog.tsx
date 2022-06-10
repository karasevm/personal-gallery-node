import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

import { useTranslation } from 'react-i18next';

function ConfirmationDialog({
  open, header, content, onConfirm, onCancel,
}:{
  open: boolean;
  header?: string;
  content?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog onClose={onCancel} open={open} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{header}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onConfirm}>
          {t('Confirm')}
        </Button>
        <Button color="primary" onClick={onCancel}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
