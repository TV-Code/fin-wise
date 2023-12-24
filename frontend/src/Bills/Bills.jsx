import React, { useState, useEffect } from 'react';
import { InputLabel, IconButton, Checkbox, Select, OutlinedInput } from '@mui/material';
import { 
    CommonStyledTextField,
    CommonStyledDatePicker,
    CommonStyledFormControl,
    CommonStyledMenuItem
} from '../CommonStyledComponents';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import { styled } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getBillsByPages, updateBillPaidStatus, deleteBill, createBill, updateBill } from '../api';
import './bills.css'
import { useSearchFilter } from '../Header/SearchFilterContext';

  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    '&.MuiIconButton-root': {
    outline: 'none',
    },
}));


const Bills = () => {
    const [bills, setBills] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [dialogType, setDialogType] = useState('create');

    const [newBillName, setNewBillName] = useState('');
    const [newBillAmount, setNewBillAmount] = useState('');
    const [newBillDueDate, setNewBillDueDate] = useState(new Date());
    const [newBillIsPaid, setNewBillIsPaid] = useState(false);
    const [newBillRecurring, setNewBillRecurring] = useState('no');
    const { search, filter } = useSearchFilter();

    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 12;
    const [totalPages, setTotalPages] = useState(1);
    const isOnFirstPage = currentPage === 1;
    const isOnLastPage = currentPage === totalPages;
    const [refreshKey, setRefreshKey] = useState('0');

    const RECURRING_OPTIONS = ['no', 'weekly', 'monthly', 'annually'];

    useEffect(() => {
        getBillsByPages(currentPage, billsPerPage, search, filter).then((data) => {
            setBills(data.bills);
            setTotalPages(Math.max(1, Math.ceil(data.totalCount / billsPerPage)));
        });
      }, [currentPage, refreshKey, search, filter]);

    const isFormValid = () => {
        if (dialogType === 'create') {
            return newBillName && newBillAmount > 0 && newBillDueDate;
        } else if (dialogType === 'update') {
            return selectedBill &&
                   selectedBill.name &&
                   selectedBill.amount > 0 &&
                   selectedBill.due_date;
        }
        return false;
    }
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const goToNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(prevPage => prevPage + 1);
    }
    };
    
    const goToPreviousPage = () => {
    if (currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
    }
    };

    const handleOpen = (bill) => {
        resetDialogState(); 
        if (bill && bill.id) {
            setDialogType('update');
            setSelectedBill({ ...bill });
        } else {
            setDialogType('create');
            setSelectedBill(null); 
        }
        setOpen(true);
    };

    const resetDialogState = () => {
        setNewBillName('');
        setNewBillAmount('');
        setNewBillDueDate(new Date());
        setNewBillIsPaid(false);
        setNewBillRecurring('no');
    };
    

    const handleClose = () => {
        resetDialogState();
        setSelectedBill(null);
        setDialogType('create');
        setOpen(false);
        setError(null);
    };
    

    const handleCreateBill = async () => {
        try {
          const payload = {
            name: newBillName,
            amount: parseFloat(newBillAmount),
            due_date: newBillDueDate.toISOString().split('T')[0],
            isPaid: newBillIsPaid,
            recurring: newBillRecurring.toLowerCase(),
          };
          console.log("Sending payload:", payload);
          const newBill = await createBill(payload);
          setBills([...bills, newBill]);
          handleClose();
        } catch (error) {
          console.error("Error creating bill:", error);
        }
        handleClose();
    };

    const handleUpdateBill = async () => {
        if (!selectedBill) return;
        try {
          const updatedBill = await updateBill(selectedBill.id, {
            ...selectedBill,
            recurring: selectedBill.recurring.toLowerCase()
          });
          setBills(bills.map(bill => bill.id === updatedBill.id ? updatedBill : bill));
          handleClose();
        } catch (error) {
          console.error("Error updating Bill:", error);
        }
      };

      const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid()) {
            setError('Please fill out all the fields.');
            return;
        }
    
        if (dialogType === 'update') {
            handleUpdateBill();
        } else {
            handleCreateBill();
        }
        handleClose();
        setRefreshKey(prevKey => prevKey + 1);
    };
    

    const handleTogglePaidStatus = async (bill) => {
        const updatedStatus = !bill.isPaid;
        await updateBillPaidStatus(bill.id, updatedStatus);
        setRefreshKey(prevKey => prevKey + 1);
      };

    const handleDelete = async (billId) => {
        await deleteBill(billId);
        setRefreshKey(prevKey => prevKey + 1);
        handleClose();
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} >
        <div className="bills">
            <div className="bills-widget-wrapper">
                <div className="bills-widget">
                    <div className="bills-title">Bills</div>
                    <div className="header-wrapper">
                    <div className="header-button"></div>
                        <button className="header-button" onClick={handleOpen}>
                            <div className="overlap-group">
                            <div className="text-wrapper-7">Add Bill</div>
                    </div>
                </button>
                </div>
                <div className="overlap">
                <div className="navbar-6">
                    <div className="text-wrapper-5">Due Date</div>
                    <div className="text-wrapper-4">Description</div>
                    <div className="text-wrapper-4">Amount</div>
                    <div className="text-wrapper-8">Paid</div>
                    <div className="text-wrapper-6">Recurring</div>
                    </div>
                    <img className="line" alt="Line" src="https://c.animaapp.com/YLmZeLfG/img/line-4.svg" />
                    <div className="bill-box">
                    {bills.slice(0, billsPerPage).map((bill, index) => (
                        <div className="bill" key={index}>
                        <div className="bill-wrapper">
                            <div className="text-wrapper-2">{bill.due_date}</div>
                            <div className="text-wrapper">{bill.name}</div>
                            <div className="text-wrapper-3">$ {bill.amount}</div>
                                <Checkbox
                                    style={{ color: 'var(--secondary-text-color)' }}
                                    checked={bill.isPaid}
                                    onChange={() => handleTogglePaidStatus(bill)}
                                    icon={<CheckBoxOutlineBlankRoundedIcon fontSize="medium"/>}
                                    checkedIcon={<CheckBoxRoundedIcon fontSize="medium"/>}
                                    className='is-paid-check'
                                />
                                <div className="div">{capitalizeFirstLetter(bill.recurring)}</div>
                        </div>
                        <div className="icon-wrapper">
                        <div className="more-icon"/>
                        <div className="line"/>
                        <div className="more-icon" onClick={() => handleOpen(bill)}>
                            <StyledIconButton>
                                <MoreHorizRoundedIcon style={{ fill: 'var(--secondary-text-color)' }}/>
                            </StyledIconButton>
                        </div>
                        </div>
                    </div>             
                    ))}
                    </div>
                    <div className='page-wrapper'>
                        <div className='nav-button'>
                            {!isOnFirstPage ? (
                                <StyledIconButton className='img' onClick={goToPreviousPage}>
                                    <NavigateNextRoundedIcon fontSize='large' style={{ fill: 'var(--secondary-text-color)' }}/>
                                </StyledIconButton>
                            ) : <div className="navigate-next-black-placeholder" />}
                        </div>
                        <div className="page-number">
                            {currentPage}/{totalPages}
                        </div>
                        <div className='nav-button'>
                            {!isOnLastPage ? (
                                <StyledIconButton className='navigate-next-black' onClick={goToNextPage}>
                                    <NavigateNextRoundedIcon fontSize='large' style={{ fill: 'var(--secondary-text-color)' }}/>
                                </StyledIconButton>
                            ) : <div className="navigate-next-black-placeholder" />}
                        </div>
                    </div>
                </div>
                </div>
                <div className={ open ? 'dialog active' : 'dialog' }>
                            <div className="dialog-content">
                                <div className="dialog-title">{dialogType === 'create' ? 'Add Bill' : 'Edit Bill' }</div>
                                {error && <div className="error">{error}</div>}
                                <div className="dialog-body">
                                    <form>
                                        <CommonStyledTextField
                                            margin="dense"
                                            label="Name"
                                            type="text"
                                            fullWidth
                                            autoComplete="off"
                                            value={dialogType === 'create' ? newBillName : (selectedBill ? selectedBill.name : '')}
                                            onChange={event => dialogType === 'create' ? setNewBillName(event.target.value) : setSelectedBill({...selectedBill, name: event.target.value})}
                                        />
                                        <CommonStyledTextField
                                            margin="dense"
                                            label="Amount"
                                            type="number"
                                            fullWidth
                                            autoComplete="off"
                                            value={dialogType === 'create' ? newBillAmount : (selectedBill ? selectedBill.amount : 0)}
                                            onChange={event => dialogType === 'create' ? setNewBillAmount(event.target.value) : setSelectedBill({...selectedBill, amount: event.target.value})}
                                        />
                                        <CommonStyledDatePicker
                                            label="Due Date"
                                            value={dialogType === 'create' ? newBillDueDate : (selectedBill ? new Date(selectedBill.due_date) : new Date())}
                                            onChange={(newValue) => {
                                            if (dialogType === 'create') {
                                                setNewBillDueDate(newValue);
                                            } else {
                                                setSelectedBill(selectedBill => ({ ...selectedBill, due_date: newValue }));
                                            }
                                        }}
                                            textField={(params) => <StyledTextField {...params} />}
                                        />
                                        <CommonStyledFormControl fullWidth margin="dense" variant="outlined">
                                        <InputLabel id="bill-recurring-label">Recurring</InputLabel>
                                            <Select
                                                labelId="bill-recurring-label"
                                                value={dialogType === 'create' ? newBillRecurring : (selectedBill ? selectedBill.recurring : 'no')}
                                                onChange={event => {
                                                    const lowercaseValue = event.target.value.toLowerCase();
                                                    if (dialogType === 'create') {
                                                        setNewBillRecurring(lowercaseValue);
                                                    } else {
                                                        setSelectedBill({...selectedBill, recurring: lowercaseValue});
                                                    }
                                                }}                                                
                                                input={<OutlinedInput label="Recurring" />}
                                            >
                                                {RECURRING_OPTIONS.map((recurring) => (
                                                    <CommonStyledMenuItem key={recurring} value={recurring.toLowerCase()}>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {capitalizeFirstLetter(recurring)}
                                                        </div>
                                                    </CommonStyledMenuItem>
                                                ))}

                                            </Select>
                                        </CommonStyledFormControl>
                                    </form>
                                </div>
                                <div className="dialog-buttons">
                                    <button onClick={handleClose} className="dialog-button">Cancel</button>
                                    {dialogType === 'update' &&
                                    <button onClick={() => handleDelete(selectedBill.id)} className="dialog-button">Delete</button>}
                                    <button onClick={handleSubmit} className="dialog-button">Submit</button>
                                </div>
                            </div>
            </div>
            
            </div>
                    </div>
        </LocalizationProvider>
    );
}

export default Bills;
