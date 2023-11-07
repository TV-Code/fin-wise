import React, { useContext, useEffect, useState } from "react";
import { Select, InputLabel, OutlinedInput } from "@mui/material";
import { CommonStyledTextField, CommonStyledFormControl, CommonStyledMenuItem } from "../CommonStyledComponents";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { styled } from "@mui/system";
import { getSavings, createSaving, updateSaving, deleteSaving, saveSelectedSavings } from "../api";
import "./savings.css";
import SavingCard from "./SavingCard";
import EditModeContext from "../editModeContext";
import { useNavigate } from "react-router-dom";

const StyledAddRoundedIcon = styled(AddRoundedIcon)(({}) => ({
fill: 'var(--primary-text-color)',
}));

const Savings = () => {
    const [savings, setSavings] = useState([]);
    const [selectedSaving, setSelectedSaving] = useState(null);
    const [selectedSavings, setSelectedSavings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('create');
    const { isSavingsEditMode, setIsSavingsEditMode } = useContext(EditModeContext);
    const navigate = useNavigate();

    const [newSavingName, setNewSavingName] = useState('');
    const [newSavingAmount, setNewSavingAmount] = useState(0);
    const [newSavingAmountSaved, setNewSavingAmountSaved] = useState(0);
    const [newSavingColor, setNewSavingColor] = useState('');

    const [error, setError] = useState(null);

    const PRESELECTED_COLORS = ['#45a6ad', '#8bc6d0', '#36605d', '#79a79d', '#5f6720', '#97bea7', '#bbcfa5', '#fbb022', '#e77f4d', '#c96149', '#c67875', '#e5a98d'];

    useEffect(() => {
        const fetchData = async () => {
            try{
                const fetchedSavings = await getSavings();
                setSavings(fetchedSavings.results);
            }
            catch (error) {
                console.error("Error fetching data", error)
            }
    };
    fetchData()
    }, []);

    const isFormValid = () => {
      if (!newSavingName || !newSavingAmount || !newSavingAmountSaved || !newSavingColor) {
        return false;
      }
      return true;
    };

    const handleOpenDialog = (type, saving = null) => {
        if (type === 'update' && saving) {
            setSelectedSaving({
              ...saving,
            });
          }
        setDialogType(type);
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSaving(null);
        setNewSavingName('');
        setNewSavingAmount(0);
        setNewSavingAmountSaved(0);
        setNewSavingColor('');
        setError(null);
    };

    const handleCreateSaving = async () => {
        try {
          const payload = {
            name: newSavingName,
            amount: parseFloat(newSavingAmount),
            saved: parseFloat(newSavingAmountSaved),
            color: newSavingColor,
          };
          console.log("Sending payload:", payload); // Log to see what you're sending
          const newSaving = await createSaving(payload);
          setSavings([...savings, newSaving]);
          handleCloseDialog();
        } catch (error) {
          console.error("Error creating Saving:", error);
        }
        handleCloseDialog();
    };
    
      const handleUpdateSaving = async () => {
        if (!selectedSaving) return;
        try {
          const updatedSaving = await updateSaving(selectedSaving.id, {
            ...selectedSaving,
          });
          setSavings(savings.map(saving => saving.id === updatedSaving.id ? updatedSaving : saving));
          handleCloseDialog();
        } catch (error) {
          console.error("Error updating Saving:", error);
        }
      };

    const handleSubmit = async () => {
        if (!isFormValid()) {
          setError('Please fill out all the fields.');
          return;
        }

        if (dialogType === 'update') {
          handleUpdateSaving();
        } else {
          handleCreateSaving();
        }
      };
  
    const handleDelete = async (id) => {
      try {
        await deleteSaving(id);
        setSavings(savings.filter(saving => saving.id !== id));
      } catch (error) {
        console.error("Error deleting Saving:", error);
      }
      handleCloseDialog();
    };

    const handleFinishSelection = async (selectedSavings) => {
      try {
        await saveSelectedSavings({ saving_ids: selectedSavings});
      } catch (error) {
        console.error("Error saving selected Savings", error);
      }
      setSelectedSavings([]);
      setIsSavingsEditMode(false);
      navigate("/");
    };

    return (
        <div className="savings">
            <div className="header">Savings</div>
            {isSavingsEditMode ? <div className="header-button" onClick={() => handleFinishSelection(selectedSavings)}><div className="text-wrapper-6">Save Selection</div></div> : ''}
            <div className="div">
            {!isSavingsEditMode ? <div className="card">
                <div className="saving-card add-saving-card" onClick={() => handleOpenDialog('create')}>
                    <StyledAddRoundedIcon style={{ fontSize: '8rem' }} />
                </div>
            </div> : ''}
            {savings && Array.isArray(savings) && savings.length > 0 && savings.map(saving => (
                <div key={saving.id} className={`card ${isSavingsEditMode && selectedSavings.includes(saving.id) ? 'selected' : ''}`} onClick={(event) => {
                  event.stopPropagation();
                  if (isSavingsEditMode) {
                    if (selectedSavings.includes(saving.id)) {
                      setSelectedSavings(prev => prev.filter(id => id !== saving.id));
                    } else if (selectedSavings.length < 2) {
                      setSelectedSavings(prev => [...prev, saving.id]);
                    }
                  } else {
                    handleOpenDialog('update', saving);
                  }
                }}>
                <SavingCard
                name={saving.name}
                amount={saving.amount}
                saved={saving.saved}
                left={saving.left}
                percentage={saving.percentage}
                color={saving.color}
                />
                </div>
            ))}
            
            
            </div>
            <div className={ openDialog ? 'dialog active' : 'dialog' }>
                        <div className="dialog-content">
                            <div className="dialog-title">{dialogType === 'create' ? 'Add Saving' : 'Edit Saving' }</div>
                            {error && <div className="error">{error}</div>}
                            <div className="dialog-body">
                                <form onSubmit={dialogType === 'create' ? handleCreateSaving : handleUpdateSaving}>
                                    <CommonStyledTextField
                                        margin="dense"
                                        label="Name"
                                        type="text"
                                        fullWidth
                                        value={dialogType === 'create' ? newSavingName : (selectedSaving ? selectedSaving.name : '')}
                                        onChange={event => dialogType === 'create' ? setNewSavingName(event.target.value) : setSelectedSaving({...selectedSaving, name: event.target.value})}
                                    />
                                    <CommonStyledTextField
                                        margin="dense"
                                        label="Amount"
                                        type="number"
                                        fullWidth
                                        value={dialogType === 'create' ? newSavingAmount : (selectedSaving ? selectedSaving.amount : 0)}
                                        onChange={event => dialogType === 'create' ? setNewSavingAmount(event.target.value) : setSelectedSaving({...selectedSaving, amount: event.target.value})}
                                    />
                                    <CommonStyledTextField
                                        margin="dense"
                                        label="Amount Saved"
                                        type="number"
                                        fullWidth
                                        value={dialogType === 'create' ? newSavingAmountSaved : (selectedSaving ? selectedSaving.saved : 0)}
                                        onChange={event => dialogType === 'create' ? setNewSavingAmountSaved(event.target.value) : setSelectedSaving({...selectedSaving, saved: event.target.value})}
                                    />
                                    <CommonStyledFormControl fullWidth margin="dense" variant="outlined">
                                    <InputLabel id="saving-color-label">Saving Color</InputLabel>
                                    <Select
                                    labelId="saving-color-label"
                                    value={dialogType === 'create' ? newSavingColor : (selectedSaving ? selectedSaving.color : '')}
                                    onChange={event => dialogType === 'create' ? setNewSavingColor(event.target.value) : setSelectedSaving({...selectedSaving, color: event.target.value})}
                                    input={<OutlinedInput label="Saving Color" />}
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
                                <button onClick={() => handleDelete(selectedSaving.id)} className="dialog-button">Delete</button>}
                                <button onClick={handleSubmit} className="dialog-button">Submit</button>
                            </div>
                            </div>
                </div>
        </div>
  );
};

export default Savings;