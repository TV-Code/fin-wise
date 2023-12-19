import React, { useState, useEffect, useContext } from 'react';
import { OutlinedInput, InputLabel, Select, MenuItem } from '@mui/material';
import { CommonStyledTextField, CommonStyledDatePicker, CommonStyledFormControl, CommonStyledMenuItem } from '../CommonStyledComponents';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { getBudgets, createBudget, updateBudget, deleteBudget, saveSelectedBudgets } from '../api';
import BudgetCard from './BudgetCard';
import { styled } from '@mui/system';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './budgets.css';
import EditModeContext from '../editModeContext';
import { useNavigate } from 'react-router-dom';

const StyledAddRoundedIcon = styled(AddRoundedIcon)(({}) => ({
  fill: 'var(--primary-text-color)',
}));

const ViewBudget = () => {
    const [budgets, setBudgets] = useState([]);
    const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
    const [dialogType, setDialogType] = useState('create');
    const { isBudgetsEditMode, setIsBudgetsEditMode } = useContext(EditModeContext);
    const navigate = useNavigate();

    const PRESELECTED_COLORS = ['#45a6ad', '#8bc6d0', '#36605d', '#79a79d', '#5f6720', '#97bea7', '#bbcfa5', '#fbb022', '#e77f4d', '#c96149', '#c67875', '#e5a98d'];
    
    // State for creating a new budget
    const [newBudgetName, setNewBudgetName] = useState('');
    const [newBudgetAmount, setNewBudgetAmount] = useState(0);
    const [newBudgetStartDate, setNewBudgetStartDate] = useState(new Date());
    const [newBudgetEndDate, setNewBudgetEndDate] = useState(new Date());
    const [newBudgetColor, setNewBudgetColor] = useState('');

    const [error, setError] = useState(null);

    const [selectedBudget, setSelectedBudget] = useState(null);
    const [selectedBudgets, setSelectedBudgets] = useState([]);

    const formatDate = (date) => `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedBudgets = await getBudgets();
                setBudgets(fetchedBudgets);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

    const isFormValid = () => {
      if (!newBudgetName || !newBudgetAmount || !newBudgetStartDate || !newBudgetEndDate || !newBudgetColor) {
        return false;
      }
      return true;
    };
  
    const handleOpenDialog = (type, budget = null) => {
      if (type === 'update' && budget) {
        setSelectedBudget({
          ...budget,
          startDate: new Date(budget.startDate),
          endDate: new Date(budget.endDate),
        });
      }
      setDialogType(type);
      setOpenBudgetDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenBudgetDialog(false);
      setSelectedBudget(null);
      setNewBudgetName('');
      setNewBudgetAmount(0);
      setNewBudgetStartDate(new Date());
      setNewBudgetEndDate(new Date());
      setNewBudgetColor('');
      setError(null);
    };
     
    const handleCreateBudget = async () => {
        try {
          const payload = {
            name: newBudgetName,
            amount: parseFloat(newBudgetAmount),
            startDate: formatDate(newBudgetStartDate),
            endDate: formatDate(newBudgetEndDate),
            color: newBudgetColor,
          };
          console.log("Sending payload:", payload); // Log to see what you're sending
          const newBudget = await createBudget(payload);
          setBudgets([...budgets, newBudget]);
          handleCloseDialog();
        } catch (error) {
          console.error("Error creating budget:", error);
        }
        handleCloseDialog();
    };
    
      const handleUpdateBudget = async () => {
        if (!selectedBudget) return;
        try {
          const updatedBudget = await updateBudget(selectedBudget.id, {
            ...selectedBudget,
            startDate: formatDate(selectedBudget.startDate),
            endDate: formatDate(selectedBudget.endDate),
          });
          setBudgets(budgets.map(budget => budget.id === updatedBudget.id ? updatedBudget : budget));
          handleCloseDialog();
        } catch (error) {
          console.error("Error updating budget:", error);
        }
      };

    const handleSubmit = async () => {
      if (!isFormValid()) {
        setError('Please fill out all the fields.');
        return;
      }

      if (dialogType === 'update') {
        handleUpdateBudget();
      } else {
        handleCreateBudget();
      }
      };
  
    const handleDelete = async (id) => {
      try {
        await deleteBudget(id);
        setBudgets(budgets.filter(budget => budget.id !== id));
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
      handleCloseDialog();
    };

    const handleFinishSelection = async (selectedBudgets) => {
      try {
        await saveSelectedBudgets({ budget_ids: selectedBudgets});
      } catch (error) {
        console.error("Error saving selected budgets", error);
      }
      setSelectedBudgets([]);
      setIsBudgetsEditMode(false);
      navigate("/");
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="budgets">
          <div className="title">Budgets</div>
          {isBudgetsEditMode ? <div className="header-button" onClick={() => handleFinishSelection(selectedBudgets)}><div className="text-wrapper-6">Save Selection</div></div> : ''}
            <div className="div">
              {!isBudgetsEditMode ? <div className="budget-card-wrapper">
                <div className="budget-card add-budget-card" onClick={() => handleOpenDialog('create')}>
                  <StyledAddRoundedIcon style={{ fontSize: '8rem' }} />
              </div>
              </div> : ''}
              {budgets.map(budget => (
              <div key={budget.id} className={`budget-card-wrapper ${isBudgetsEditMode && selectedBudgets.includes(budget.id) ? 'selected' : ''}`} onClick={(event) => {
                event.stopPropagation();
                if (isBudgetsEditMode) {
                  if (selectedBudgets.includes(budget.id)) {
                    setSelectedBudgets(prev => prev.filter(id => id !== budget.id));
                  } else if (selectedBudgets.length < 4) {
                    setSelectedBudgets(prev => [...prev, budget.id]);
                  }
                } else {
                  handleOpenDialog('update', budget);
                }
              }}>
                <BudgetCard
                  name={budget.name}
                  startDate={budget.startDate}
                  endDate={budget.endDate}
                  spent={budget.spent}
                  left={budget.left}
                  total={budget.amount}
                  color={budget.color}
                  percentage={budget.percentage}
                />
              </div>
            ))}
            </div>
          

          <div className={openBudgetDialog ? 'dialog active' : 'dialog' }>
            <div className="dialog-content">
                <div className="dialog-title">{dialogType === 'create' ? 'Add Budget' : 'Edit Budget' }</div>
                {error && <div className="error">{error}</div>}
                <div className="dialog-body">
                    <form onSubmit={dialogType === 'create' ? handleCreateBudget : handleUpdateBudget}>
                        <CommonStyledTextField
                            margin="dense"
                            label="Name"
                            type="text"
                            fullWidth
                            autoComplete="off"
                            value={dialogType === 'create' ? newBudgetName : (selectedBudget ? selectedBudget.name : '')}
                            onChange={event => dialogType === 'create' ? setNewBudgetName(event.target.value) : setSelectedBudget({...selectedBudget, name: event.target.value})}
                        />
                        <CommonStyledTextField
                            margin="dense"
                            label="Amount"
                            type="number"
                            fullWidth
                            autoComplete="off"
                            value={dialogType === 'create' ? newBudgetAmount : (selectedBudget ? selectedBudget.amount : 0)}
                            onChange={event => dialogType === 'create' ? setNewBudgetAmount(event.target.value) : setSelectedBudget({...selectedBudget, amount: event.target.value})}
                        />
                        <CommonStyledDatePicker
                          label="Start Date"
                          value={dialogType === 'create' ? newBudgetStartDate : (selectedBudget ? selectedBudget.startDate : new Date())}
                          onChange={(newValue) => {
                              if (dialogType === 'create') {
                                  setNewBudgetStartDate(newValue);
                              } else {
                                  setSelectedBudget(selectedBudget => ({ ...selectedBudget, startDate: newValue }));
                              }
                          }}
                          textField={(params) => <TextField {...params} />}
                          sx={{ mr: 2 }}
                      />
                        <CommonStyledDatePicker
                            label="End Date"
                            value={dialogType === 'create' ? newBudgetEndDate : (selectedBudget ? selectedBudget.endDate : new Date())}
                            onChange={(newValue) => {
                              if (dialogType === 'create') {
                                  setNewBudgetEndDate(newValue);
                              } else {
                                  setSelectedBudget(selectedBudget => ({ ...selectedBudget, endDate: newValue }));
                              }
                          }}
                            textField={(params) => <TextField {...params} />}
                        />
                        <CommonStyledFormControl fullWidth margin="dense">
                        <InputLabel id="budget-color-label">Budget Color</InputLabel>
                        <Select
                          labelId="budget-color-label"
                          value={dialogType === 'create' ? newBudgetColor : (selectedBudget ? selectedBudget.color : '')}
                          onChange={event => dialogType === 'create' ? setNewBudgetColor(event.target.value) : setSelectedBudget({...selectedBudget, color: event.target.value})}
                          input={<OutlinedInput label="Budget Color"/>}
                        >
                          {PRESELECTED_COLORS.map((color) => (
                            <CommonStyledMenuItem key={color} value={color}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ backgroundColor: color, width: 24, height: 24, marginRight: 10, borderRadius: '50%' }}></div>
                                {color}
                              </div>
                            </CommonStyledMenuItem>
                          ))}
                        </Select>
                      </CommonStyledFormControl>
                    </form>
                </div>
                <div className="dialog-buttons">
                    <button onClick={handleCloseDialog} className="dialog-button">Cancel</button>
                    {dialogType === 'update' &&
                      <button onClick={() => handleDelete(selectedBudget.id)} className="dialog-button">Delete</button>}
                    <button onClick={handleSubmit} className="dialog-button">Submit</button>
                </div>
            </div>
        </div>
        </div>
    </LocalizationProvider>
  );
};

export default ViewBudget;
