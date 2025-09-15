// context/FinanceContext.tsx
'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Account, Category, Transaction, Budget, Bill, initialAccounts, initialCategories, initialTransactions, initialBudgets, initialBills } from '../lib/financeData';

interface FinanceState {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
}

type FinanceAction =
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'UPDATE_BILL'; payload: Bill }
  | { type: 'DELETE_BILL'; payload: string }
  | { type: 'PAY_BILL'; payload: { billId: string; transactionId: string; date: string } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_ACCOUNT_BALANCE'; payload: { accountId: string; amount: number } };

const initialState: FinanceState = {
  accounts: initialAccounts,
  categories: initialCategories,
  transactions: initialTransactions,
  budgets: initialBudgets,
  bills: initialBills,
};

const financeReducer = (state: FinanceState, action: FinanceAction): FinanceState => {
  switch (action.type) {
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
  addAccount: (account: Account) => void;
  addTransaction: (transaction: Transaction) => void;
  addBudget: (budget: Budget) => void;
  addBill: (bill: Bill) => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
  payBill: (billId: string, transactionId: string, date: string) => void;
  deleteTransaction: (id: string) => void;
  updateAccountBalance: (accountId: string, amount: number) => void;
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
  getCategorySpending: (categoryId: string, period?: 'week' | 'month' | 'year') => number;
  getUpcomingBills: (days?: number) => Bill[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(state));
  }, [state]);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // We'll need to merge with initial data to ensure we have all required fields
        // For simplicity in this example, we're just using the initial state
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  const addAccount = (account: Account) => {
    dispatch({ type: 'ADD_ACCOUNT', payload: account });
  };

  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addBudget = (budget: Budget) => {
    dispatch({ type: 'ADD_BUDGET', payload: budget });
  };

  const addBill = (bill: Bill) => {
    dispatch({ type: 'ADD_BILL', payload: bill });
  };

  const updateBill = (bill: Bill) => {
    dispatch({ type: 'UPDATE_BILL', payload: bill });
  };

  const deleteBill = (id: string) => {
    dispatch({ type: 'DELETE_BILL', payload: id });
  };

  const payBill = (billId: string, transactionId: string, date: string) => {
    dispatch({ type: 'PAY_BILL', payload: { billId, transactionId, date } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
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
        addAccount,
        addTransaction,
        addBudget,
        addBill,
        updateBill,
        deleteBill,
        payBill,
        deleteTransaction,
        updateAccountBalance,
        getTotalBalance,
        getAccountBalance,
        getCategorySpending,
        getUpcomingBills,
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