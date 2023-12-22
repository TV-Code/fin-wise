import React, { useState, useEffect } from 'react';
import { IconButton, Checkbox, TextField, Select, MenuItem, InputLabel, useMediaQuery } from '@mui/material';
import { CommonStyledTextField, CommonStyledDatePicker, CommonStyledFormControl, CommonStyledMenuItem } from '../CommonStyledComponents';
import { getTransactionsByPages, createTransaction, updateTransaction, deleteTransaction, createBulkTransactions, updateBulkTransactions, getBudgets } from '../api';
import { useSearchFilter } from '../Header/SearchFilterContext';
import { styled } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import BulkEditForm from './BulkEditForm';
import CSVUploader from './CSVUploader';
import './transactions.css';
import { useTheme } from '@emotion/react';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  '&.MuiIconButton-root': {
    outline: 'none',
  },
}));

const Transactions = () => {
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState('create');
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
      description: '',
      amount: 0,
      date: new Date(),
      type: 'inbound',
      budget: '',
  });

  const { search, filter } = useSearchFilter();

  const [error, setError] = useState(null);

  const [budgets, setBudgets] = useState([]);
  const [transactionsArray, setTransactionsArray] = useState([]);
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [openCSV, setOpenCSV] = useState(false);
  const [openBulkEdit, setOpenBulkEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);
  const isOnFirstPage = currentPage === 1;
  const isOnLastPage = currentPage === totalPages;
  const [refreshKey, setRefreshKey] = useState(0);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down(901));
  const isMobile = useMediaQuery(theme.breakpoints.down(641));
  

  useEffect(() => {
    getTransactionsByPages(currentPage, transactionsPerPage, search, filter).then((data) => {
        setTransactions(data.transactions);
        setTotalPages(Math.ceil(data.totalCount / transactionsPerPage));
    });
  }, [currentPage, refreshKey, search, filter]);
  

  useEffect(() => {
    async function fetchBudgets() {
        let fetchedBudgets = await getBudgets();
        setBudgets(fetchedBudgets);
    }

    fetchBudgets();
}, []);

useEffect(() => {
  if (!selectionMode) {
    setSelectedTransactions([]);
  }
}, [selectionMode]);

const isFormValid = () => {
  if (dialogType === 'create') {
    return transactionForm.description && transactionForm.amount > 0 && transactionForm.date;
  } else if (dialogType === 'update') {
    return selectedTransaction &&
           selectedTransaction.description &&
           selectedTransaction.amount > 0 &&
           selectedTransaction.date;
  }
  return false;
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

  const handleOpen = (transaction) => {
    if (transaction && transaction.id) {
      setDialogType('update')
      setSelectedTransaction({
        ...transaction,
        date: parseISO(transaction.date)
      })
    }
    else {
      setSelectedTransaction('');
    }
    setOpen(true);
  };

  const handleOpenCSV = () => {
    setOpenCSV(true);
  };

  const handleOpenBulkEdit = () => {
    setOpenBulkEdit(true);
  };

  const handleClose = () => {
    resetDialogState();
    setCsvUploaded(false);
    setOpenCSV(false);
    setOpen(false);
    setDialogType('create');
    setOpenBulkEdit(false);
    setError(null);
  };  

  const handleSubmit = () => {
    if (!isFormValid()) {
      setError('Please fill out all the fields.');
      return;
    }

    if (dialogType === 'create') {
      handleCreateTransaction();
    }
    else {
      handleUpdateTransaction();
    }
  };

  const toggleTransactionSelection = (transactionId) => {
    setSelectedTransactions(prev => {
        if (prev.includes(transactionId)) {
            return prev.filter(id => id !== transactionId);
        } else {
            return [...prev, transactionId];
        }
    });
};

  function cleanDescription(description) {
    if (!description) return "MISC. TRANSACTION";

    // Remove currency conversion details
    description = description.replace(/\d+\.\d{2} (CAD|USD|MXN|EUR|GBP|AUD|...) @ \d+\.\d{6}/, '').trim();

    // Remove all numerical sequences 
    description = description.replace(/\d{4,}/g, '').trim();

    // Remove everything after "SERVICE CHARGE" but not the term itself
    if (description.includes("SERVICE CHARGE")) {
      description = description.split("SERVICE CHARGE")[0] + "SERVICE CHARGE";
  }

    // Remove common noise words/phrases
    const noisePatterns = [
        /Point of Sale/i,
        /Debit/i,
        /Credit/i,
        /Transaction/i,
        /Internet Banking/i,
        /INTL/i,
        /VISA/i,
        /VISA/i,
        /DEB/i,
        /CRED/i,
        /RETAIL PURCHASE/i,
        /#[A-Z0-9]*/i,  // sequences like #ABC123
        /\*/g,  // asterisks
        /VISA DEB/i,
        /^- /i,  // Leading dash with space
        /INTERAC/i,
        /BRANCH/i,
        /ADD TXN/i,
        /MONTHLY/i,
        /RECORD-KEEPING/i
    ];
    
    noisePatterns.forEach(pattern => {
        description = description.replace(pattern, '').trim();
    });

    // If the description is empty or is still just numbers, set it to "MISC. TRANSACTION"
    if (!description || /^\d+$/.test(description)) {
        return "MISC. TRANSACTION";
    }

    return description.toUpperCase();
  }

  const handleDrop = async (parsedData) => {
    setCsvUploaded(true);
    
    const results = parsedData.data;

    const newTransactionsArray = results.map(row => {
        const amountInbound = parseFloat(row[3]);
        const amountOutbound = parseFloat(row[2]);

        // Determine type and amount based on inbound/outbound values
        let type, amount;
        if (amountInbound > 0) {
            type = 'inbound';
            amount = amountInbound;
        } else {
            type = 'outbound';
            amount = amountOutbound;
        }

        return {
            date: row[0],
            description: cleanDescription(row[1]),
            amount: amount,
            type: type
        };
    })
    .filter(transaction => transaction.date && transaction.description && transaction.amount && transaction.type);

    setTransactionsArray(newTransactionsArray);
  };



  const handleCreateBulkTransactions = async (transactionsArray) => {
    try {
        const response = await createBulkTransactions(transactionsArray);
        setTransactions(prevTransactions => [...prevTransactions, ...response]);
    } catch (error) {
        console.error("Error during bulk transaction creation:", error);
    }
};

const bulkUpdate = async (bulkEditFields) => {
  try {
    const updatedData = await updateBulkTransactions(selectedTransactions, bulkEditFields);
    if (updatedData) {
      const updatedTransactions = transactions.map(t => {
        if (selectedTransactions.includes(t.id)) {
          return {
            ...t,
            ...bulkEditFields
          };
        }
        return t;
      });
      setTransactions(updatedTransactions);
    }
    setRefreshKey(prevKey => prevKey + 1);
  } catch (error) {
    console.error("Error updating transactions in component:", error);
  }
  setSelectionMode(false);
};

  const resetDialogState = () => {
      setTransactionForm({
        description: '',
        amount: 0,
        date: new Date(),
        type: 'inbound',
        budget: '',
      })
  };
  
  const handleCreateTransaction = async () => {
    if (csvUploaded) {
      await handleCreateBulkTransactions(transactionsArray);
    } else {
      const newTransaction = await createTransaction({
        date: transactionForm.date.toISOString().split('T')[0],
        description: transactionForm.description,
        amount: transactionForm.amount,
        type: transactionForm.type,
        budget: transactionForm.budget
      });
  
      console.log(newTransaction)
      setTransactions([...transactions, newTransaction]);
  
      resetDialogState();
    }
    
    setTransactionsArray([]);
    handleClose();
  };

  const handleUpdateTransaction = async () => {
    const formattedDate = `${selectedTransaction.date.getFullYear()}-${String(selectedTransaction.date.getMonth() + 1).padStart(2, '0')}-${String(selectedTransaction.date.getDate()).padStart(2, '0')}`;

    const formattedData = {
      ...selectedTransaction,
      date: formattedDate,
      budget: selectedTransaction.budget
  };
  

    const updatedTransaction = await updateTransaction(selectedTransaction.id, formattedData);

    if (updatedTransaction) {
        setTransactions(transactions.map(transaction => transaction.id === updatedTransaction.id ? updatedTransaction : transaction));
    } else {
        console.error("Transaction update failed!");
    }
  
    handleClose();
};


  const handleDeleteTransaction = async (id) => {
    await deleteTransaction(id);
  
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    handleClose();
  };  
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="transactions">
      <div className="transaction-widget-wrapper">
        <div className="transaction-widget">
        <div className="recent-transactions">Transactions</div>
        <div className="header-wrapper">
        <div className="overlap-wrapper" onClick={handleOpenCSV}>
          <button className='header-button'>
            <div className="overlap-group">
              <div className="text-wrapper-7">Upload CSV</div>
            </div>
            </button>
        </div>
          <div className="group" onClick={handleOpen}>
            <button className='header-button'>
            <div className="overlap-group">
              <div className="text-wrapper-6">{!isMobile ? 'Add Transaction' : 'Add'}</div>
            </div>
            </button>
        </div>
        </div>
          <div className="overlap">
            <div className="title-wrapper">
            <div className="text-wrapper-4">Date</div>
            {!isTablet ? <div className="text-wrapper-5">Description</div> : ''}
            <div className="text-wrapper-3">Amount</div>
            </div>
            <div className="icon-wrapper">
              <div className="edit-icon">
                {selectionMode && (
                    <StyledIconButton onClick={handleOpenBulkEdit}>
                        <EditNoteRoundedIcon style={{ fill: 'var(--secondary-text-color)' }}/>
                    </StyledIconButton>
                )}
              </div>
              <img className="line" alt="Line" src="https://c.animaapp.com/YLmZeLfG/img/line-4.svg" />
              <div className="morevert-icon">
              <StyledIconButton onClick={() => setSelectionMode(!selectionMode)}>
                <MoreVertRoundedIcon style={{ fill: 'var(--secondary-text-color)' }}/>
              </StyledIconButton>
              </div>
            </div>
            <div className="transaction-box">
            {transactions.slice(0, transactionsPerPage).map((transaction, index) => (
            <div className={`transaction ${selectedTransactions.includes(transaction.id) ? 'selected-transaction' : ''}`}
             key={index}
             >
              <div className="transaction-wrapper">
              <div className="text-wrapper">
                <div className="desc-and-circles">
                    {!isTablet ? <span 
                        className="budget-circle"
                        style={{backgroundColor: transaction.color ? transaction.color: 'white'}}
                    ></span> : ''}
                    <div className="description">{transaction.description}</div>
                    <span 
                        className="budget-circle"
                        style={{backgroundColor: transaction.color ? transaction.color : 'white'}}
                    ></span>
                </div>
                <div className="transaction-date">{transaction.date}</div>
            </div>
            <div className="text-wrapper-2">
            <div className={transaction.type == "inbound" ? "inbound" : "outbound"}>
                {transaction.type == "inbound" ? "" : "-"}$ {transaction.amount}
            </div>
            </div>
              </div>
              <div className="transaction-icons">
              {selectionMode ? (
                <>
                  <Checkbox
                    style={{ color: 'var(--secondary-text-color)' }}
                    checked={selectedTransactions.includes(transaction.id)}
                    onChange={() => toggleTransactionSelection(transaction.id)}
                    icon={<CheckBoxOutlineBlankRoundedIcon fontSize="medium"/>}
                    checkedIcon={<CheckBoxRoundedIcon fontSize="medium"/>}
                    className="check-box"
                  />
                  <div className="line"/>
                  <div className="more-icon"/>
                  </>
              ) : (
                <>
                  <div className="check-box"/>
                  <div className="line"/>
                  <div className="more-icon" onClick={() => handleOpen(transaction)}>
                      <StyledIconButton>
                          <MoreHorizRoundedIcon style={{ fill: 'var(--secondary-text-color)' }}/>
                      </StyledIconButton>
                  </div>
                  </>
              )}
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
        <div className={open ? 'dialog active' : 'dialog'}>
          <div className="dialog-content">
              <div className="dialog-title">{dialogType === 'create' ? 'Add Transaction' : 'Edit Transaction' }</div>
              {error && <div className="error">{error}</div>}
              <div className="dialog-body">
            <form>
              <CommonStyledTextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                autoComplete="off"
                value={dialogType ==='create' ? transactionForm.description : (selectedTransaction ? selectedTransaction.description : '')}
                onChange={event => {
                  if (dialogType === 'create') {
                    setTransactionForm(prevForm => ({ ...prevForm, description: event.target.value }));
                  } else {
                    setSelectedTransaction(prevTransaction => ({ ...prevTransaction, description: event.target.value }));
                  }
                }}
              />
              <CommonStyledTextField
                margin="dense"
                label="Amount"
                type="number"
                fullWidth
                autoComplete="off"
                value={dialogType === 'create' ? transactionForm.amount : (selectedTransaction ? selectedTransaction.amount : '')}
                onChange={event => {
                  if (dialogType === 'create') {
                    setTransactionForm(prevForm => ({ ...prevForm, amount: event.target.value }));
                  } else {
                    setSelectedTransaction(prevTransaction => ({ ...prevTransaction, amount: event.target.value }));
                  }
                }}
              />
              <CommonStyledDatePicker
                label="Transaction date"
                fullWidth
                value={dialogType === 'create' ? transactionForm.date : (selectedTransaction ? new Date(selectedTransaction.date) : new Date())}
                onChange={(newValue) => {
                  if (dialogType === 'create') {
                    setTransactionForm(prevForm => ({ ...prevForm, date: newValue}))
                  }
                  else {
                    setSelectedTransaction({...selectedTransaction, date: newValue})
                  }
                }}
                textField={(params) => <TextField {...params} />}
              />
              <CommonStyledFormControl fullWidth margin="dense" variant="outlined">
              <Select
                value={dialogType === 'create' ? transactionForm.type : (selectedTransaction ? selectedTransaction.type : 'inbound')}
                onChange={event => {
                  if (dialogType === 'create') {
                    setTransactionForm(prevForm => ({ ...prevForm, type: event.target.value }));
                  } else {
                    setSelectedTransaction(prevTransaction => ({ ...prevTransaction, type: event.target.value }));
                  }
                }}
              >
                <CommonStyledMenuItem value={'inbound'}>Inbound</CommonStyledMenuItem>
                <CommonStyledMenuItem value={'outbound'}>Outbound</CommonStyledMenuItem>
              </Select>
              </CommonStyledFormControl>
              <CommonStyledFormControl fullWidth margin="dense" variant="outlined">
              <InputLabel id="transaction-budget-label">Budget</InputLabel>
              <Select
                  label="Budget"
                  labelId="transaction-budget-label"
                  value={transactionForm.budget}
                  onChange={event => {
                    if (dialogType === 'create') {
                      setTransactionForm(prevForm => ({ ...prevForm, budget: event.target.value }));
                    } else {
                      setSelectedTransaction(prevTransaction => ({ ...prevTransaction, budget: event.target.value }));
                    }
                  }}
              >
                  {budgets.map(budget => (
                      <MenuItem key={budget.id} value={budget.id}>
                          {budget.name}
                      </MenuItem>
                  ))}
              </Select>
              </CommonStyledFormControl>
            </form>
            </div>
        <div className="dialog-buttons">
            <button onClick={handleClose} className="dialog-button">Cancel</button>
            {dialogType === 'update' &&
            <button className='dialog-button' onClick={() => handleDeleteTransaction(selectedTransaction.id)}>Delete</button>}
            <button onClick={handleSubmit} className="dialog-button">{dialogType === 'create' ? 'Submit' : 'Save'}</button>
        </div>
      </div>
      </div>
      <BulkEditForm
        selectedTransactions={selectedTransactions}
        budgets={budgets}
        onSubmit={(fields) => bulkUpdate(fields)}
        openBulkEdit={openBulkEdit}
        handleClose={handleClose}
      />
      <div className={ openCSV ? 'dialog active' : 'dialog' }>
        <div className='dialog-content'>
        <div className='dialog-title'>Upload Transactions</div>
        <div className='dialog-body'>
            <CSVUploader onDrop={handleDrop} />
        </div>
        <div className='dialog-buttons'>
            <button className='dialog-button' onClick={() => setOpenCSV(false)}>Cancel</button>
            <button className='dialog-button' onClick={() => handleCreateTransaction(transactionsArray)}>Submit</button>
        </div>
      </div>
      </div>
      </div>
    </div>
  </LocalizationProvider>
);};

export default Transactions;
