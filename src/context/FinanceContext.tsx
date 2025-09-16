// context/FinanceContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  Account, 
  Category, 
  Transaction, 
  Budget, 
  Bill, 
  initialCategories
} from '../lib/financeData';
import { 
  getAccounts, 
  addAccount, 
  updateAccount, 
  deleteAccount,
  getTransactions, 
  addTransaction, 
  deleteTransaction, 
  getBudgets, 
  addBudget, 
  getBills, 
  addBill, 
  updateBill, 
  deleteBill,
  addCategory,
  getCategories
} from '../lib/supabaseData';
import { useAuth } from './AuthContext';

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  loading: boolean;
}

type FinanceAction =
  | { type: 'SET_DATA'; payload: Partial<FinanceState> }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_BILL'; payload: Bill }
  | { type: 'DELETE_BILL'; payload: string }
  | { type: 'PAY_BILL'; payload: { billId: string; transactionId: string; date: string } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_ACCOUNT_BALANCE'; payload: { accountId: string; amount: number } }
  | { type: 'ADD_CATEGORY'; payload: Category };

const initialState: FinanceState = {
  accounts: [],
  categories: initialCategories,
  transactions: [],
  budgets: [],
  bills: [],
  loading: false,
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [action.payload, ...state.transactions],
        accounts: state.accounts.map(account => 
          account.id === action.payload.accountId 
            ? { ...account, balance: account.balance + (action.payload.type === 'income' ? action.payload.amount : -action.payload.amount) }
            : account
        )
      };
    
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    
    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'UPDATE_BILL':
      return { 
        ...state, 
        bills: state.bills.map(bill => 
          bill.id === action.payload.id ? action.payload : bill
        )
      };
    
    case 'DELETE_BILL':
      return { 
        ...state, 
        bills: state.bills.filter(bill => bill.id !== action.payload)
      };
    
    case 'PAY_BILL':
      // This action marks a bill as paid by adding a transaction
      const paidBill = state.bills.find(b => b.id === action.payload.billId);
      if (!paidBill) return state;
      
      const newTransaction: Transaction = {
        id: action.payload.transactionId,
        accountId: paidBill.accountId,
        categoryId: paidBill.categoryId,
        amount: paidBill.amount,
        description: `Payment for ${paidBill.name}`,
        date: action.payload.date,
        type: 'expense',
        createdAt: new Date().toISOString(),
      };
      
      return {
        ...state,
        transactions: [newTransaction, ...state.transactions],
        accounts: state.accounts.map(account => 
          account.id === paidBill.accountId 
            ? { ...account, balance: account.balance - paidBill.amount }
            : account
        ),
        bills: state.bills.map(bill => 
          bill.id === action.payload.billId 
            ? { ...bill, lastPaidDate: action.payload.date }
            : bill
        )
      };
    
    case 'DELETE_TRANSACTION':
      const transactionToDelete = state.transactions.find(t => t.id === action.payload);
      if (!transactionToDelete) return state;
      
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        accounts: state.accounts.map(account =>
          account.id === transactionToDelete.accountId
            ? { ...account, balance: account.balance - (transactionToDelete.type === 'income' ? transactionToDelete.amount : -transactionToDelete.amount) }
            : account
        )
      };
    
    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.accountId
            ? { ...account, balance: account.balance + action.payload.amount }
            : account
        )
      };
    
    default:
      return state;
  }
};

interface FinanceContextType extends FinanceState {
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  updateBill: (bill: Bill) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  payBill: (billId: string, transactionId: string, date: string) => void;
  deleteTransaction: (id: string) => Promise<void>;
  updateAccountBalance: (accountId: string, amount: number) => void;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getCategorySpending: (categoryId: string, period?: 'week' | 'month' | 'year') => number;
  getUpcomingBills: (days?: number) => Bill[];
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { user } = useAuth();

  // Load data from Supabase
  const refreshData = async () => {
    if (!user) return;
    
    dispatch({ type: 'SET_DATA', payload: { loading: true } });
    
    try {
      const [accounts, transactions, budgets, bills, categories] = await Promise.all([
        getAccounts(user.id),
        getTransactions(user.id),
        getBudgets(user.id),
        getBills(user.id),
        getCategories(),
      ]);
      
      dispatch({ 
        type: 'SET_DATA', 
        payload: { 
          accounts, 
          transactions, 
          budgets, 
          bills, 
          categories,
          loading: false 
        } 
      });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_DATA', payload: { loading: false } });
    }
  };

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const addAccountHandler = async (account: Omit<Account, 'id'>) => {
    if (!user) return;
    
    try {
      const result = await addAccount(user.id, account);
      // Use the account returned from the database which includes the generated ID
      if (result && result.length > 0) {
        const newAccount: Account = {
          id: result[0].id,
          name: result[0].name,
          type: result[0].type,
          balance: result[0].balance,
          currency: result[0].currency,
        };
        dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
      } else {
        // Only use fallback in development
        if (process.env.NODE_ENV === 'development') {
          const newAccount: Account = {
            ...account,
            id: Date.now().toString(),
          };
          dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
        }
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const updateAccountHandler = async (account: Account) => {
    try {
      await updateAccount(account);
      // Update the account in the state
      dispatch({ 
        type: 'SET_DATA', 
        payload: { 
          accounts: state.accounts.map(acc => 
            acc.id === account.id ? account : acc
          )
        } 
      });
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const deleteAccountHandler = async (id: string) => {
    try {
      await deleteAccount(id);
      // Remove the account from the state
      dispatch({ 
        type: 'SET_DATA', 
        payload: { 
          accounts: state.accounts.filter(account => account.id !== id)
        } 
      });
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const addTransactionHandler = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const result = await addTransaction(user.id, transaction);
      // Use the transaction returned from the database which includes the generated ID
      if (result && result.length > 0) {
        const newTransaction: Transaction = {
          id: result[0].id,
          accountId: result[0].account_id,
          categoryId: result[0].category_id,
          amount: result[0].amount,
          description: result[0].description,
          date: result[0].date,
          type: result[0].type,
          createdAt: result[0].created_at,
        };
        dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
      } else {
        // Only use fallback in development
        if (process.env.NODE_ENV === 'development') {
          const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };
          dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
        }
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const addBudgetHandler = async (budget: Omit<Budget, 'id'>) => {
    if (!user) return;
    
    try {
      const result = await addBudget(user.id, budget);
      // Use the budget returned from the database which includes the generated ID
      if (result && result.length > 0) {
        const newBudget: Budget = {
          id: result[0].id,
          categoryId: result[0].category_id,
          amount: result[0].amount,
          period: result[0].period,
          startDate: result[0].start_date,
          endDate: result[0].end_date,
        };
        dispatch({ type: 'ADD_BUDGET', payload: newBudget });
      } else {
        // Only use fallback in development
        if (process.env.NODE_ENV === 'development') {
          const newBudget: Budget = {
            ...budget,
            id: Date.now().toString(),
          };
          dispatch({ type: 'ADD_BUDGET', payload: newBudget });
        }
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const addBillHandler = async (bill: Omit<Bill, 'id'>) => {
    if (!user) return;
    
    try {
      const result = await addBill(user.id, bill);
      // Use the bill returned from the database which includes the generated ID
      if (result && result.length > 0) {
        const newBill: Bill = {
          id: result[0].id,
          name: result[0].name,
          amount: result[0].amount,
          dueDate: result[0].due_date,
          accountId: result[0].account_id,
          categoryId: result[0].category_id,
          isActive: result[0].is_active,
          lastPaidDate: result[0].last_paid_date || undefined,
        };
        dispatch({ type: 'ADD_BILL', payload: newBill });
      } else {
        // Only use fallback in development
        if (process.env.NODE_ENV === 'development') {
          const newBill: Bill = {
            ...bill,
            id: Date.now().toString(),
          };
          dispatch({ type: 'ADD_BILL', payload: newBill });
        }
      }
    } catch (error) {
      console.error('Error adding bill:', error);
    }
  };

  const addCategoryHandler = async (category: Omit<Category, 'id'>) => {
    try {
      const result = await addCategory('', category); // userId not needed for categories table
      // Use the category returned from the database which includes the generated ID
      if (result && result.length > 0) {
        const newCategory: Category = {
          id: result[0].id,
          name: result[0].name,
          type: result[0].type,
          icon: result[0].icon,
          color: result[0].color,
        };
        dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateBillHandler = async (bill: Bill) => {
    try {
      await updateBill(bill);
      dispatch({ type: 'UPDATE_BILL', payload: bill });
    } catch (error) {
      console.error('Error updating bill:', error);
    }
  };

  const deleteBillHandler = async (id: string) => {
    try {
      await deleteBill(id);
      dispatch({ type: 'DELETE_BILL', payload: id });
    } catch (error) {
      console.error('Error deleting bill:', error);
    }
  };

  const payBill = (billId: string, transactionId: string, date: string) => {
    dispatch({ type: 'PAY_BILL', payload: { billId, transactionId, date } });
  };

  const deleteTransactionHandler = async (id: string) => {
    try {
      await deleteTransaction(id);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateAccountBalance = (accountId: string, amount: number) => {
    dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { accountId, amount } });
  };

  const getTotalBalance = () => {
    return state.accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getAccountBalance = (accountId: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    return account ? account.balance : 0;
  };

  const getCategorySpending = (categoryId: string, period?: 'week' | 'month' | 'year') => {
    const now = new Date();
    const startDate = new Date();
    
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return state.transactions
      .filter(t => 
        t.categoryId === categoryId && 
        t.type === 'expense' && 
        (!period || new Date(t.date) >= startDate)
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getUpcomingBills = (days: number = 7) => {
    const today = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + days);
    
    return state.bills.filter(bill => {
      if (!bill.isActive) return false;
      
      // Create a date for this month's due date
      const dueThisMonth = new Date();
      dueThisMonth.setDate(bill.dueDate);
      
      // If the due date has passed this month, check next month
      if (dueThisMonth < today) {
        dueThisMonth.setMonth(dueThisMonth.getMonth() + 1);
      }
      
      return dueThisMonth <= upcomingDate;
    });
  };

  return (
    <FinanceContext.Provider
      value={{
        ...state,
        addAccount: addAccountHandler,
        updateAccount: updateAccountHandler,
        deleteAccount: deleteAccountHandler,
        addTransaction: addTransactionHandler,
        addBudget: addBudgetHandler,
        addBill: addBillHandler,
        updateBill: updateBillHandler,
        deleteBill: deleteBillHandler,
        payBill,
        deleteTransaction: deleteTransactionHandler,
        updateAccountBalance,
        addCategory: addCategoryHandler,
        getTotalBalance,
        getAccountBalance,
        getCategorySpending,
        getUpcomingBills,
        refreshData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};