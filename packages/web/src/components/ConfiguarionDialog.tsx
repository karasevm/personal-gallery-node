import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Theme,
  Tooltip,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import generateConfig from '../utils/ShareX';
import { availableLanguages } from '../i18n';
import { Config, SortBy, SortOrder } from '../types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  wide: {
    width: '100%',
  },
  buttonSpan: {
    display: 'inline-flex',
    flexGrow: 1,
  },
  button: {
    flexGrow: 1,
  },
}));

const ConfigurationDialog = ({
  open,
  onDialogClose,
  currentSettings,
  onSave,
  onApiKeyChange,
  onCredentialsChange,
  apiKey,
}: {
  open: boolean;
  onDialogClose: () => void;
  currentSettings: Config;
  onSave: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onApiKeyChange: () => void;
  onCredentialsChange: () => void;
  apiKey?: string;
}) => {
  const [sortBy, setSortBy] = useState(currentSettings.sortBy);
  const [sortOrder, setSortOrder] = useState(currentSettings.sortOrder);
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const handleSave = () => {
    onSave(sortBy, sortOrder);
  };
  const downloadSharexConfig = () => {
    if (typeof apiKey === 'undefined') {
      return;
    }
    const configText = generateConfig(
      window.location.href.replace(/\/$/, ''),
      apiKey,
    );
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(configText)}`,
    );
    element.setAttribute(
      'download',
      `${window.location.href.replace(/\/$/, '')}-sharex.sxcu`,
    );
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return (
    <Dialog onClose={onDialogClose} open={open} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{t('Settings')}</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          Configure how you want your list to be displayed.
        </DialogContentText> */}
        <form className={classes.form} noValidate>
          <FormControl className={classes.formControl}>
            <FormLabel component="legend">{t('Sort By')}</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="position"
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
                setSortBy(e.target.value as SortBy)
              )}
            >
              <FormControlLabel
                value={SortBy.Name}
                control={<Radio color="primary" />}
                label={t('Name')}
              />
              <FormControlLabel
                value={SortBy.Date}
                control={<Radio color="primary" />}
                label={t('Upload date')}
              />
            </RadioGroup>
          </FormControl>
          <FormControl className={classes.formControl}>
            <FormLabel component="legend">{t('Sort Direction')}</FormLabel>
            <RadioGroup
              row
              aria-label="position"
              name="position"
              value={sortOrder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => (
                setSortOrder(e.target.value as SortOrder)
              )}
            >
              <FormControlLabel
                value={SortOrder.Ascending}
                control={<Radio color="primary" />}
                label={t('Ascending')}
              />
              <FormControlLabel
                value={SortOrder.Descending}
                control={<Radio color="primary" />}
                label={t('Descending')}
              />
            </RadioGroup>
          </FormControl>
        </form>
        <div className={classes.form}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={i18n.language.slice(0, 2)}
              onChange={(e) => i18n.changeLanguage(e.target.value as string)}
            >
              {availableLanguages.map((lang) => (
                <MenuItem value={lang.short} key={lang.short}>
                  {lang.longLocal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            className={classes.formControl}
            variant="contained"
            color="primary"
            onClick={onCredentialsChange}
          >
            {t('Change username/password')}
          </Button>
          <Button
            className={classes.formControl}
            variant="contained"
            color="primary"
            onClick={onApiKeyChange}
          >
            {t('Get API key')}
          </Button>
          <Tooltip
            title={(
              <>
                {t('You must first get a new API key')}
              </>
            )}
            disableFocusListener={typeof apiKey !== 'undefined'}
            disableHoverListener={typeof apiKey !== 'undefined'}
            disableTouchListener={typeof apiKey !== 'undefined'}
          >
            <span className={classes.buttonSpan}>
              <Button
                disabled={typeof apiKey === 'undefined'}
                className={`${classes.formControl} ${classes.button}`}
                variant="contained"
                color="primary"
                onClick={downloadSharexConfig}
              >
                {t('Get ShareX config')}
              </Button>
            </span>
          </Tooltip>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave}>
          {t('Save')}
        </Button>
        <Button color="primary" onClick={onDialogClose}>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurationDialog;
