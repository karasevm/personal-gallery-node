import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import {useTranslation} from 'react-i18next';

function ConfirmationDialog({
  isOpen: open, header, content, onConfirm, onCancel,
}: {
  readonly isOpen: boolean;
  readonly header?: string;
  readonly content?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}) {
  const {t} = useTranslation();
  return (
    <Dialog open={open} aria-labelledby='dialog-title' onClose={onCancel}>
      <DialogTitle id='dialog-title'>{header}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={onConfirm}>
          {t('Confirm')}
        </Button>
        <Button color='primary' onClick={onCancel}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
