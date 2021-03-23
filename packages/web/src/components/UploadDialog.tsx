/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  createStyles,
  Dialog,
  DialogTitle,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => createStyles({
  dropzone: {
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
  },
  icon: {
    fontSize: '2rem',
  },
  accept: {
    borderColor: 'green !important',
  },
  reject: {
    borderColor: 'red !important',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));
const UploadDialog = ({
  isOpen, onClose, onDrop, accept,
}:{
  isOpen: boolean;
  onClose: () => void;
  onDrop: (files: File[]) => void;
  accept: string[];
}) => {
  const classes = useStyles();
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
          className={classes.closeButton}
          onClick={onClose}
        >
          <span className="material-icons">close</span>
        </IconButton>
      </DialogTitle>
      <section>
        <div
          {...getRootProps({
            className: `dropzone ${classes.dropzone} ${
              isDragAccept ? classes.accept : null
            } ${isDragReject ? classes.reject : null}`,
          })}
        >
          <input {...getInputProps()} />
          <span className={classes.icon}>
            {isDragActive ? null : '📁'}
            {isDragAccept ? '📂' : null}
            {isDragReject ? '❌' : null}
          </span>
          <p>{t('Drag and drop some files here, or click to select files')}</p>
        </div>
      </section>
    </Dialog>
  );
};

export default UploadDialog;
