/* eslint-disable react/jsx-props-no-spreading */
/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  Dialog, DialogTitle, IconButton, Theme,
} from '@mui/material';
import { css } from '@emotion/react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';

function UploadDialog({
  isOpen, onClose, onDrop, accept,
}:{
  isOpen: boolean;
  onClose: () => void;
  onDrop: (files: File[]) => void;
  accept: string[];
}) {
  const theme: Theme = useTheme();
  const styles = {
    dropzone: css({
      textAlign: 'center',
      padding: '20px',
      border: '3px dashed #eeeeee',
      backgroundColor: '#fafafa',
      color: '#bdbdbd',
      marginBottom: '20px',
      marginLeft: '20px',
      marginRight: '20px',
      height: '20vh',
      minWidth: '40vw',
      transition: 'border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    }),
    icon: css({
      fontSize: '2rem',
    }),
    accept: css({
      borderColor: 'green !important',
    }),
    reject: css({
      borderColor: 'red !important',
    }),
    closeButton: css({
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    }),
  };
  const { t } = useTranslation();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDropAccepted: (acceptedFiles) => onDrop(acceptedFiles),
    accept,
  });
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      // onDragLeave={() => setDragOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
    >
      <DialogTitle id="alert-dialog-title">
        {t('Upload')}
        <IconButton
          aria-label="close"
          css={styles.closeButton}
          onClick={onClose}
          size="large"
        >
          <span className="material-icons">close</span>
        </IconButton>
      </DialogTitle>
      <section>
        <div
          {...getRootProps({
            css: [
              styles.dropzone,
              isDragAccept ? styles.accept : null,
              isDragReject ? styles.reject : null],
            className: 'dropzone ',
          })}
        >
          <input {...getInputProps()} />
          <span css={styles.icon}>
            {isDragActive ? null : '📁'}
            {isDragAccept ? '📂' : null}
            {isDragReject ? '❌' : null}
          </span>
          <p>{t('Drag and drop some files here, or click to select files')}</p>
        </div>
      </section>
    </Dialog>
  );
}

export default UploadDialog;
