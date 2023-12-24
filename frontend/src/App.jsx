import { useEffect, useState } from 'react';
import {  BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import './global.css';
import MainContent from './MainContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SearchFilterProvider } from './Header/SearchFilterContext';
import EditModeContext from './editModeContext';

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
  components: {
    MuiButton: {
      styleOverrides: {
        textPrimary: {
          color: 'var(--primary-button-color)', // Replace with your desired color
          // Add any other styles you need
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'var(--primary-text-color)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--primary-color)',
        }
      }
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: 'var(--primary-text-color)',
          '&:hover': {
            backgroundColor: 'var(--primary-hover-color)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--primary-button-color)',
            color: 'var(--primary-text-color)',
            '&:hover': {
              backgroundColor: 'var(--primary-button-hover-color)',
            },
          },
        },
        weekDayLabel: {
          color: 'var(--secondary-text-color)',
        },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          // Apply your custom styles here
          color: 'var(--secondary-text-color)', // Example style
          // Add any other styles you need
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        switchHeader: {
          // Calendar header styles
          backgroundColor: 'var(--secondary-text-color)',
          color: 'var(--primary-text-color)',
        },
        iconButton: {
          // Icon button in the header
          color: 'var(--secondary-text-color)',
        },
        dayLabel: {
          // Weekday labels
          color: 'var(--primary-text-color)',
        },
        label: {
          // Styles for the month label in the header
          color: 'var(--secondary-text-color)',
        },
        switchViewButton: {
          // Apply your custom styles here
          color: 'var(--secondary-text-color)', // Example style
          // Add any other styles you need
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          color: 'var(--secondary-text-color)',
        },
      },
    },
    MuiYearCalendar: {
      styleOverrides: {
        root: {
          color: 'var(--primary-text-color)',
        },
      },
    },
    MuiPickersYear: {
      styleOverrides: {
        yearButton: {
          '&:hover': {
            backgroundColor: 'var(--primary-hover-color)',
          },
          "&.Mui-selected": {
            backgroundColor: 'var(--primary-button-color)',
            color: 'var(--primary-text-color)',
            '&:hover': {
              backgroundColor: 'var(--primary-button-hover-color)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: 'var(--primary-text-color)',
          backgroundColor: 'var(--primary-color)',
          '& .MuiPickersCalendarHeader-root, & .MuiPickersCalendarHeader-label': {
            color: 'var(--secondary-text-color)',
          },
        },
      },
    },
  },
});


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBudgetsEditMode, setIsBudgetsEditMode] = useState(false);
  const [isSavingsEditMode, setIsSavingsEditMode] = useState(false);

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
