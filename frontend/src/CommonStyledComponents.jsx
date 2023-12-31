import { styled } from '@mui/system';
import { TextField, FormControl, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const CommonStyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--primary-text-color)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--primary-text-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--primary-button-color)',
        },
    },
    '& .MuiFormLabel-root': {
        color: 'var(--primary-text-color)',
        fontFamily: 'Lato, Helvetica',
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: 'var(--primary-text-color)',
    },
    '& .MuiInputBase-input': {
        color: 'var(--primary-text-color)',
        fontFamily: 'Lato, Helvetica'
    },
}));

export const CommonStyledDatePicker = styled(DatePicker)(({ theme }) => ({
    backgroundColor: 'var(--primary-color)',
    color: 'var(--primary-text-color)',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--primary-text-color)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--primary-text-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--primary-button-color)',
        },
    },
    '& .MuiPickersDay-root': {
        color: 'var(--primary-color)', // Custom color for the day numbers
      },
    '& .MuiSvgIcon-root': {
        color: 'var(--primary-text-color)',
    },
    '& .MuiFormLabel-root': {
        color: 'var(--primary-text-color)',
        fontFamily: 'Lato, Helvetica',
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: 'var(--primary-text-color)',
    },
    '& .MuiInputBase-input': {
        color: 'var(--primary-text-color)',
        backgroundColor: 'var(--primary-colour)',
        fontFamily: 'Lato, Helvetica',
    },
    '& .MuiPickersDay-day': {
        color: 'var(--primary-text-color)',
    },
    
    "& .MuiDialog-paper": {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--primary-text-color)',
      },
    
      // Target the root of the desktop calendar pop-up (popover)
      "& .MuiPopover-paper": {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--primary-text-color)',
      },
    
      // Target selected day
      "& .MuiPickersDay-daySelected": {
        backgroundColor: 'var(--primary-hover-color)',
      },
    
      // Target day on hover
      "& .MuiPickersDay-day:hover": {
        backgroundColor: 'var(--primary-hover-color)',
      },
      
      '& .MuiPickersDay-root:hover': {
        backgroundColor: 'var(--primary-hover-color)', // For hovered day
    },
    
      // Target month and year navigation buttons
      "& .MuiPickersCalendarHeader-iconButton": {
        color: 'var(--primary-text-color)',
      },
}));

export const CommonStyledFormControl = styled(FormControl)(({ theme }) => ({
    fontFamily: 'Lato, Helvetica',
    maxWidth: '100%',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--primary-text-color)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--primary-text-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--primary-button-color)',
        },
    },
    '& .MuiFormLabel-root': {
        color: 'var(--primary-text-color)',
        fontFamily: 'Lato, Helvetica',
    },
    '& .MuiFormLabel-root.Mui-focused': {
        color: 'var(--primary-text-color)',
    },
    '& .MuiInputBase-input': {
        color: 'var(--primary-text-color)',
        fontFamily: 'Lato, Helvetica',
    },
    '& .MuiMenuItem-root': {
        color: 'var(--primary-text-color)',
    },
}));

export const CommonStyledMenuItem = styled(MenuItem)(({ theme }) => ({
    fontFamily: 'Lato, Helvetica',
    color: "var(--primary-text-color)",
    backgroundColor: "var(--primary-color)",
        "&:hover": {
            backgroundColor: "var(--primary-hover-color)"
        },
        "&.Mui-selected": {
            backgroundColor: "var(--primary-hover-color)",
        },
    '& .MuiPopover-paper .MuiMenu-paper': {
        '& .MuiMenuItem-root': {
            fontFamily: 'Lato, Helvetica',
            color: 'var(--primary-text-color)',
            backgroundColor: 'var(--primary-color)',
        }
    },
}));
