import React, { useEffect, useState } from 'react';
import { Select, MenuItem, OutlinedInput, InputLabel } from '@mui/material';
import { CommonStyledTextField, CommonStyledDatePicker, CommonStyledFormControl } from '../CommonStyledComponents';
import './transactions.css';

const BulkEditForm = ({ selectedTransactions, budgets, onSubmit, handleClose, openBulkEdit }) => {
  const [bulkEditFields, setBulkEditFields] = useState({
    description: '',
    amount: 0,
    type: '',
    budget: '',
    date: null,
  });

  const formatDate = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  useEffect(() => {
    const fields = ['description', 'amount', 'type', 'budget', 'date'];
  
    fields.forEach(field => {
      const allValues = selectedTransactions.map(t => t[field]);
      const isVaried = [...new Set(allValues)].length > 1;
      if (isVaried) {
        setBulkEditFields(prev => ({ ...prev, [field]: 'Varies' }));
      }
    });
  }, [selectedTransactions]);
  

  const handleBulkEditSubmit = (event) => {
    event.preventDefault();

    const updates = {};
    for (let key in bulkEditFields) {
      if (bulkEditFields[key] !== '' && bulkEditFields[key] !== null && bulkEditFields[key] !== 0) {
        updates[key] = key === 'date' ? formatDate(bulkEditFields[key]) : bulkEditFields[key];
      }
    }

    onSubmit(updates);
    handleCancel();
  };

  const handleCancel = () => {
    setBulkEditFields({
      description: '',
      amount: 0,
      type: '',
      budget: '',
      date: null,
    });
    handleClose();
  };

  return (
    <div className={openBulkEdit ? 'dialog active' : 'dialog' }>
      <div className="dialog-content">
        <div className="dialog-title">Edit {selectedTransactions.length} Transactions</div>
        <div className="dialog-body">
          <form onSubmit={handleBulkEditSubmit}>
            <CommonStyledTextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              value={bulkEditFields.description}
              onChange={event => setBulkEditFields({ ...bulkEditFields, description: event.target.value })}
            />
            <CommonStyledTextField
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              value={bulkEditFields.amount}
              onChange={event => setBulkEditFields({ ...bulkEditFields, amount: parseFloat(event.target.value) })}
            />
            <CommonStyledDatePicker
              label="Date"
              value={bulkEditFields.date}
              onChange={(newValue) => {
                setBulkEditFields({ ...bulkEditFields, date: new Date(newValue) });
              }}
              textField={(params) => <TextField {...params} />}
            />
            <CommonStyledFormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="transaction-type-label">Type</InputLabel>
            <Select
              label="Type"
              labelId="transaction-type-label"
              value={bulkEditFields.type}
              onChange={event => setBulkEditFields({ ...bulkEditFields, type: event.target.value })}
              input={<OutlinedInput label="Type"/>}
            >
              <MenuItem value={'inbound'}>Inbound</MenuItem>
              <MenuItem value={'outbound'}>Outbound</MenuItem>
            </Select>
            </CommonStyledFormControl>
            <CommonStyledFormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="transaction-budget-label">Budget</InputLabel>
            <Select
              label="Budget"
              labelId="transaction-budget-label"
              value={bulkEditFields.budget}
              onChange={event => setBulkEditFields({ ...bulkEditFields, budget: event.target.value })}
              input={<OutlinedInput label="Budget"/>}
              >
                {budgets.map(budget => (
                      <MenuItem key={budget.id} value={budget.id}>
                          {budget.name}
                      </MenuItem>
                  ))}
            </Select>
            </CommonStyledFormControl>
            <div className="dialog-buttons">
              <button type="button" className="dialog-button" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="dialog-button">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkEditForm;
