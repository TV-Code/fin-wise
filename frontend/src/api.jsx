import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const csrftoken = getCookie('csrftoken');

if (csrftoken) {
  api.defaults.headers.post['X-CSRFToken'] = csrftoken;
}

api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401 && !error.response.config.url.includes(`/users/login`)) {
    window.location.href = '/login';
  }
  return Promise.reject(error);
});


// Function to get all transactions
export const getTransactions = async () => {
  try {
    const response = await api.get(`/transactions/?paginate=false`);
    return Array.isArray(response.data) ? response.data : response.data.transactions;
  } catch (error) {
    console.error("Error fetching transactions: ", error);
    return [];
  }
}

// Function to retrieve paginated transactions
export const getTransactionsByPages = async (currentPage, transactionsPerPage, search="", filter="") => {
  try {
    const response = await api.get(`/transactions/?page=${currentPage}&page_size=${transactionsPerPage}&searchDescription=${search}&filter=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving transactions: ", error);
    return null;
  }
}

// Function to create a new transaction
export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post(`/transactions/`, transactionData);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction: ", error);
    return null;
  }
}

// Function to update a transaction
export const updateTransaction = async (transactionId, transactionData) => {
    try {
      const response = await api.put(`/transactions/${transactionId}/`, transactionData);
      return response.data;
    } catch (error) {
      console.error("Error updating transaction: ", error.response.data);
      return null;
    }
  };
  
// Function to delete a transaction
export const deleteTransaction = async (transactionId) => {
  try {
    const response = await api.delete(`/transactions/${transactionId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting transaction: ", error);
    return null;
  }
}

// Function to create bulk transactions
export const createBulkTransactions = async (transactionsArray) => {
  try {
      const response = await api.post(`/transactions/bulk_create/`, transactionsArray);
      // Check if response is okay (status code 200-299)
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.detail || 'Something went wrong.'}`);
      }

      return await response.json();

  } catch (error) {
      console.error("Failed to create bulk transactions:", error);
      throw error;  // Re-throwing the error to be caught by the caller
  }
}

export const updateBulkTransactions = async (selectedTransactions, bulkEditFields) => {
  const updates = selectedTransactions.map(id => ({
    id: id,
    ...bulkEditFields
  }));

  try {
    const response = await api.patch(`/transactions/bulk_update/`, updates);
    if (response.status === 204) {
      return response.data;
    }
  } catch (error) {
    console.error("Error during bulk update:", error);
    throw error;  // Re-throwing the error to be caught by the caller
  }
};

// Function to get all budgets
export const getBudgets = async () => {
    try {
      const response = await api.get(`/budgets/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching budgets: ", error);
      return [];
    }
  }
  
// Function to create a new budget
export const createBudget = async (budgetData) => {
  try {
    const response = await api.post(`/budgets/`, budgetData);
    return response.data;
  } catch (error) {
    console.error("Error creating budget: ", error);
    return null;
  }
}

// Function to update a budget
export const updateBudget = async (budgetId, budgetData) => {
  try {
    const response = await api.put(`/budgets/${budgetId}/`, budgetData);
    return response.data;
  } catch (error) {
    console.error("Error updating budget: ", error);
    return null;
  }
}

// Function to delete a budget
export const deleteBudget = async (budgetId) => {
  try {
    const response = await api.delete(`/budgets/${budgetId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting budget: ", error);
    return null;
  }
}

export const getSelectedBudgets = async () => {
  try {
    const response = await api.get(`/budgets/getSelectedBudgets/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching selected budgets", error);
    return null;
  }
}

export const saveSelectedBudgets = async (selectedBudgets) => {
  try {
    const response = await api.post(`/budgets/saveSelectedBudgets/`, selectedBudgets);
    return response.data;
  } catch (error) {
    console.error("Error saving selected budgets", error);
    return null;
  }
}

// Function to retrieve paginated transactions
export const getBillsByPages = async (currentPage, billsPerPage, search, filter) => {
  try {
    const response = await api.get(`/bills/?page=${currentPage}&page_size=${billsPerPage}&searchDescription=${search}&filter=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Error retrieving bills: ", error);
    return null;
  }
}

  // Function to get all bills
export const getBills = async () => {
  try {
    const response = await api.get(`/bills/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bills: ", error);
    return [];
  }
}

// Function to create a new bill
export const createBill = async (billData) => {
  try {
    const response = await api.post(`/bills/`, billData);
    return response.data;
  } catch (error) {
    console.error("Error creating bill: ", error);
    return null;
  }
}

// Function to update a bill
export const updateBill = async (billId, billData) => {
  try {
    const response = await api.put(`/bills/${billId}/`, billData);
    return response.data;
  } catch (error) {
    console.error("Error updating bill: ", error.response.data);
    return null;
  }
};

export const updateBillPaidStatus = async (billId, isPaid) => {
  try {
    const response = await api.patch(`/bills/${billId}/mark-paid/`, { isPaid });
    return response.data;
  } catch (error) {
    console.error("Error updating bill's paid status: ", error);
    return null;
  }
};

// Function to delete a bill
export const deleteBill = async (billId) => {
  try {
    const response = await api.delete(`/bills/${billId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bill: ", error);
    return null;
  }
}

// Function to get all savings
export const getSavings = async () => {
  try {
    const response = await api.get(`/savings/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching savings: ", error);
    return [];
  }
}

// Function to create a new saving
export const createSaving = async (savingData) => {
  try {
    const response = await api.post(`/savings/`, savingData);
    return response.data;
  } catch (error) {
    console.error("Error creating saving: ", error);
    return null;
  }
}

// Function to update a saving
export const updateSaving = async (savingId, savingData) => {
  try {
    const response = await api.put(`/savings/${savingId}/`, savingData);
    return response.data;
  } catch (error) {
    console.error("Error updating saving: ", error);
    return null;
  }
}

// Function to delete a saving
export const deleteSaving = async (savingId) => {
  try {
    const response = await api.delete(`/savings/${savingId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting saving: ", error);
    return null;
  }
}

export const saveSelectedSavings = async (selectedSavings) => {
  try {
    const response = await api.post(`/savings/saveSelectedSavings/`, selectedSavings);
    return response.data;
  } catch (error) {
    console.error("Error saving selected savings", error);
    return null;
  }
}

export const getSelectedSavings = async () => {
  try {
    const response = await api.get(`/savings/getSelectedSavings/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching selected savings", error);
    return null;
  }
}

// Function to get the spending breakdown
export const getSpendingBreakdown = async () => {
  try {
    const response = await api.get(`/spending-breakdown/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching spending breakdown: ", error);
    return [];
  }
}

// Function to get budget vs actual spending
export const getBudgetVsActual = async (budgetId) => {
  try {
    const response = await api.get(`/budget-vs-actual?budget_id=${budgetId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (username, password, rememberMe) => {
  try {
      const response = await api.post(`/users/login/`, { username, password, remember_me: rememberMe });
      console.log("API Response:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error during login:", error.response ? error.response.data : error.message);
      throw error;
  }
}

export const signupUser = async (username, password) => {
  try {
      const response = await api.post(`/users/signup/`, { username, password });
      return response.data;
  } catch (error) {
      console.error("Error during signup:", error.response ? error.response.data : error.message);
      throw error;
  }
}

// This can be a simple API call since the backend will handle deleting the cookie.
export const logoutUser = async () => {
  try {
    await api.post(`/users/logout/`);
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export const authCheck = async () => {
  try {
    const response = await api.get(`/users/auth_check/`);
    if (response.status !== 200) {
      throw new Error('Not Authenticated');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};