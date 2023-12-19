import React, { useEffect, useState } from 'react';
import './sidebar.css';
import { Drawer, IconButton, useTheme, useMediaQuery, Icon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { logoutUser } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    hideBackdrop: true,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRight: 'none',
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '2%',
  color: 'var(--primary-text-color)',
  zIndex: '10',
  fontSize: '24px',
}))

const dashboardIconLight = "https://c.animaapp.com/gj7lBTnF/img/dashboard-black-24dp-1.svg";
const dashboardIconDark = "https://c.animaapp.com/rY9olsf1/img/dashboard-black-24dp-1.svg";
const transactionsIconLight = "https://c.animaapp.com/gj7lBTnF/img/account-balance-black-24dp-1.svg";
const transactionsIconDark = "https://c.animaapp.com/rY9olsf1/img/account-balance-black-24dp-1.svg";
const billsIconLight = "https://c.animaapp.com/gj7lBTnF/img/receipt-long-black-24dp-1.svg";
const billsIconDark = "https://c.animaapp.com/rY9olsf1/img/receipt-long-black-24dp-1.svg";
const budgetsIconLight = "https://c.animaapp.com/gj7lBTnF/img/balance-black-24dp-1.svg";
const budgetsIconDark = "https://c.animaapp.com/rY9olsf1/img/balance-black-24dp-1.svg";
const savingsIconLight = "https://c.animaapp.com/gj7lBTnF/img/savings-black-24dp-1.svg";
const savingsIconDark = "https://c.animaapp.com/rY9olsf1/img/savings-black-24dp-1.svg";
const logOutIconLight = "/logout_black_24dp 2 (1).svg"
const logOutIconDark = "/logout_black_24dp 2.svg";


function Sidebar() {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark-mode'));
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down(1280));

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-mode'));
    };

    window.addEventListener('themeChanged', updateTheme);

    return () => {
      window.removeEventListener('themeChanged', updateTheme);
    };
  }, []);

  const closeSidebar = () => {
    setIsSidebarActive(false);
  };

  const logOut = async () => {
    try {
      logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
    {(isMobile || isTablet) && (
      <div className="sidebar-icon">
        <StyledIconButton onClick={() => setIsSidebarActive(!isSidebarActive)}>
          <MenuIcon fontSize="large"/>
        </StyledIconButton>
      </div>
      )}

      <StyledDrawer 
        variant={(isMobile || isTablet) ? 'temporary' : 'permanent'} 
        open={isSidebarActive} 
        onClose={() => setIsSidebarActive(false)}
      >
        <div className="sidebar">
        <div className="overlap-wrapper">
          <div className="overlap">
            <div className="sidebarbg" />
            <Link to="/" className="dashboardroute" onClick={closeSidebar}>
              <div className="overlap-group">
                <div className="rectangle" />
                <img
                  className="img"
                  alt="Dashboard"
                  src={isDarkMode ? dashboardIconDark : dashboardIconLight}
                />
                <div className="div">Dashboard</div>
              </div>
            </Link>
            <Link to="/transactions" className="transactionsroute" onClick={closeSidebar}>
              <div className="overlap-group">
                <div className="rectangle" />
                <img
                  className="img"
                  alt="Transactions"
                  src={isDarkMode ? transactionsIconDark : transactionsIconLight}
                />
                <div className="div">Transactions</div>
              </div>
            </Link>
            <Link to="/bills" className="billsroute" onClick={closeSidebar}>
              <div className="overlap-group">
                <div className="rectangle" />
                <img
                  className="img"
                  alt="Bills"
                  src={isDarkMode ? billsIconDark : billsIconLight}
                />
                <div className="div">Bills</div>
              </div>
            </Link>
            <Link to="/budgets" className="budgetroute" onClick={closeSidebar}>
              <div className="overlap-group">
                <div className="rectangle" />
                <img
                  className="img"
                  alt="Budgets"
                  src={isDarkMode ? budgetsIconDark : budgetsIconLight}
                />
                <div className="div">Budgets</div>
              </div>
            </Link>
            <Link to="/savings" className="savingsroute" onClick={closeSidebar}>
              <div className="overlap-group">
                <div className="rectangle" />
                <img
                  className="img"
                  alt="Savings"
                  src={isDarkMode ? savingsIconDark : savingsIconLight}
                />
                <div className="div">Savings</div>
              </div>
            </Link>
            <IconButton className="logout-button" onClick={logOut}>
              <div className="overlap-group">
                <div className="rectangle" />
                <img 
                  className="img"
                  alt="Log Out"
                  src={isDarkMode ? logOutIconDark : logOutIconLight}
                />
                <div className="div">Log Out</div>
              </div>
            </IconButton>
          </div>
        </div>
      </div>
      </StyledDrawer>
    </>
  );
}

export default Sidebar;
