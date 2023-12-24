import React from 'react';
import './header.css';
import { Select, MenuItem, InputAdornment, InputLabel } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useSearchFilter } from './SearchFilterContext';
import { CommonStyledTextField, CommonStyledFormControl } from '../CommonStyledComponents';

const Header = ({ filters }) => {
    const { search, setSearch, filter, setFilter } = useSearchFilter();

    return (
        <div className="header">
        <div className="header-bg">
        <div className="header-bar">
        {filters && filters.length > 0 && (
            <>
            <CommonStyledFormControl sx={{ height: "40px"}}>
            <InputLabel id="filter-label-id">Sort By</InputLabel>
            <Select 
                label="Sort By"
                labelid="filter-label-id"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                    height: "40px", 
                    marginRight: "10px", 
                    fontFamily: "Lato, Arial, Helvetica",
                    "& .MuiSelect-icon": {
                        color: "var(--primary-text-color)"
                    },
                    "& .MuiPaper-root": {
                        fontFamily: "Lato, Arial, Helvetica",
                        backgroundColor: "var(--primary-color)"
                    },
                    "& .MuiMenu-paper": {
                        backgroundColor: "var(--primary-color)",
                    },
                    "& .MuiPopover-root .MuiMenu-root .MuiModal-root .css-1sucic7 .MuiPaper-root .MuiPaper-elevation .MuiPaper-rounded .MuiPaper-elevation8 .MuiMenu-paper .MuiPopover-paper .MuiMenu-paper .css-pwxzbm": {
                        backgroundColor: "var(--primary-color)"
                    }
                }}
            >
                {filters && filters.map((filter) => (
                    <MenuItem key={filter} value={filter} sx={{
                        color: "var(--primary-text-color)",
                        backgroundColor: "var(--primary-color)",
                        fontFamily: "Lato, Arial, Helvetica",
                        "&:hover": {
                            backgroundColor: "var(--primary-hover-color)"
                        },
                        "&.Mui-selected": {
                            backgroundColor: "var(--primary-hover-color)",
                        }
                    }}>
                        {filter}
                    </MenuItem>
                ))}
            </Select>
            </CommonStyledFormControl>
            <InputLabel id="search-label-id"></InputLabel>
            <CommonStyledTextField
                label="Search"
                labelid="search-label-id"
                variant="standard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                sx={{ 
                    fontFamily: "Lato, Arial, Helvetica",
                    bottom: "5px",
                    minWidth: "120px",
                    width: "15%",
                    "& .MuiInputBase-root": {
                        fontFamily: "Lato, Arial, Helvetica",
                        "&:before": {
                            borderBottom: "1.5px solid var(--primary-text-color)"
                        },
                        "&:hover:before": {
                            borderBottom: "2px solid var(--primary-button-color)"
                        },
                        "&.Mui-focused:before": {
                            borderBottom: "2px solid var(--primary-button-color)"
                        }
                    },
                    "& .MuiInput-underline:after": {
                        borderBottom: "2px solid var(--primary-button-color)"
                    }
                }}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchRoundedIcon sx={{color: "var(--primary-text-color)"}}/>
                      </InputAdornment>
                    ),
                  }}
            />
            </>
        )}
        </div>
        </div>  
        </div>
    );
};

export default Header;
