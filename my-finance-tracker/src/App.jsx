import { useEffect, useState } from 'react';
import {  BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import './global.css';
import MainContent from './MainContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SearchFilterProvider } from './Header/SearchFilterContext';
import EditModeContext from './editModeContext';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBudgetsEditMode, setIsBudgetsEditMode] = useState(false);
  const [isSavingsEditMode, setIsSavingsEditMode] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#8AAAE5',
      },
      background: {
        default: 'var(--primary-bg-color)'
      },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            backgroundColor: '#FFFFFF',
          },
        },
      },
      MuiPickersToolbar: {
        toolbar: {
          backgroundColor: "var(--primary-color)",
        },
      },
      MuiPickersCalendarHeader: {
        switchHeader: {
          backgroundColor: "var(--primary-color)",
          color: "var(--primary-text-color)",
        },
      },
    },
  });
  

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       setIsDarkMode(true);
    }
}, []);

useEffect(() => {
  if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      window.dispatchEvent(new Event('themeChanged'));
  } else {
      document.documentElement.classList.remove('dark-mode');
      window.dispatchEvent(new Event('themeChanged'));
  }
}, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <SearchFilterProvider>
        <EditModeContext.Provider value={{ isBudgetsEditMode, setIsBudgetsEditMode, isSavingsEditMode, setIsSavingsEditMode }}>
      <div>
        <CssBaseline /> 
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }} >
        <div className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
          <div className="icon"></div>
        </div>
        <Router>
          <MainContent />
        </Router>
        </div> 
      </div>
      </EditModeContext.Provider>
      </SearchFilterProvider>
    </ThemeProvider>
  );
}

export default App;
