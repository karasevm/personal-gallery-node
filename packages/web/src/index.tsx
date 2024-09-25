import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider, createTheme, type Theme} from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/cyrillic-ext-300.css';
import '@fontsource/roboto/cyrillic-ext-400.css';
import '@fontsource/roboto/cyrillic-ext-500.css';
import '@fontsource/roboto/cyrillic-ext-700.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './icons/icons.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import i18n from './i18n';

// Declare module '@mui/styles/defaultTheme' {
//   type DefaultTheme = Theme;
// }
serviceWorkerRegistration.register();
const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
  },
});
ReactDOM.render(
  <React.StrictMode>
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <App/>
      </ThemeProvider>
    </CssBaseline>
  </React.StrictMode>,
  document.querySelector('#root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
