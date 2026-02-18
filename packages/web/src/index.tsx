import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, type Theme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/cyrillic-ext-300.css';
import '@fontsource/roboto/cyrillic-ext-400.css';
import '@fontsource/roboto/cyrillic-ext-500.css';
import '@fontsource/roboto/cyrillic-ext-700.css';
import App from './App';
import './icons/icons.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import i18n from './i18n';

serviceWorkerRegistration.register();
const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    }
  }
});
const container = document.querySelector('#root');
if (container != null) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <CssBaseline>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </CssBaseline>
    </React.StrictMode>
  );
}
