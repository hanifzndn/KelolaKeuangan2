// lib/financeData.ts
export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'investment';
  balance: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of the month (1-31)
  accountId: string;
  categoryId: string;
  isActive: boolean;
  lastPaidDate?: string;
}

export const initialAccounts: Account[] = [
  { id: '1', name: 'Cash', type: 'cash', balance: 5000000, currency: 'IDR' },
  { id: '2', name: 'Bank Account', type: 'bank', balance: 15000000, currency: 'IDR' },
  { id: '3', name: 'Credit Card', type: 'credit', balance: -2000000, currency: 'IDR' },
];

export const initialCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', icon: '💰', color: 'bg-green-500' },
  { id: '2', name: 'Freelance', type: 'income', icon: '💻', color: 'bg-green-400' },
  { id: '3', name: 'Food & Dining', type: 'expense', icon: '🍔', color: 'bg-red-500' },
  { id: '4', name: 'Transportation', type: 'expense', icon: '🚗', color: 'bg-blue-500' },
  { id: '5', name: 'Shopping', type: 'expense', icon: '🛍️', color: 'bg-purple-500' },
  { id: '6', name: 'Entertainment', type: 'expense', icon: '🎬', color: 'bg-yellow-500' },
  { id: '7', name: 'Utilities', type: 'expense', icon: '💡', color: 'bg-gray-500' },
  { id: '8', name: 'Health', type: 'expense', icon: '🏥', color: 'bg-red-400' },
];

export const initialTransactions: Transaction[] = [
  { 
    id: '1', 
    accountId: '1', 
    categoryId: '1', 
    amount: 5000000, 
    description: 'Monthly Salary', 
    date: '2025-09-01', 
    type: 'income', 
    createdAt: '2025-09-01T09:00:00Z' 
  },
  { 
    id: '2', 
    accountId: '1', 
    categoryId: '3', 
    amount: 1500000, 
    description: 'Grocery Shopping', 
    date: '2025-09-05', 
    type: 'expense', 
    createdAt: '2025-09-05T18:30:00Z' 
  },
  { 
    id: '3', 
    accountId: '1', 
    categoryId: '4', 
    amount: 300000, 
    description: 'Gasoline', 
    date: '2025-09-10', 
    type: 'expense', 
    createdAt: '2025-09-10T08:15:00Z' 
  },
  { 
    id: '4', 
    accountId: '2', 
    categoryId: '2', 
    amount: 2000000, 
    description: 'Freelance Project', 
    date: '2025-09-15', 
    type: 'income', 
    createdAt: '2025-09-15T14:20:00Z' 
  },
];

export const initialBudgets: Budget[] = [
  { 
    id: '1', 
    categoryId: '3', 
    amount: 2000000, 
    period: 'monthly', 
    startDate: '2025-09-01', 
    endDate: '2025-09-30' 
  },
  { 
    id: '2', 
    categoryId: '4', 
    amount: 500000, 
    period: 'monthly', 
    startDate: '2025-09-01', 
    endDate: '2025-09-30' 
  },
];

export const initialBills: Bill[] = [
  { 
    id: '1', 
    name: 'Electricity Bill', 
    amount: 500000, 
    dueDate: 10, 
    accountId: '2', 
    categoryId: '7', 
    isActive: true 
  },
  { 
    id: '2', 
    name: 'Water Bill', 
    amount: 200000, 
    dueDate: 15, 
    accountId: '2', 
    categoryId: '7', 
    isActive: true 
  },
  { 
    id: '3', 
    name: 'Internet/WiFi', 
    amount: 300000, 
    dueDate: 5, 
    accountId: '2', 
    categoryId: '7', 
    isActive: true 
  },
];