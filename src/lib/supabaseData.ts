// src/lib/supabaseData.ts
import { supabase } from './supabaseClient'
import { Account, Category, Transaction, Budget, Bill, initialCategories } from './financeData'

// User interface
export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

// Database interfaces (Supabase format)
export interface DBAccount extends Omit<Account, 'type'> {
  user_id: string
  type: string
}

export interface DBTransaction extends Omit<Transaction, 'type'> {
  user_id: string
  type: string
}

export interface DBBudget {
  id: string
  user_id: string
  category_id: string
  amount: number
  period: string
  start_date: string
  end_date: string
}

export interface DBBill extends Omit<Bill, 'dueDate' | 'isActive' | 'lastPaidDate'> {
  user_id: string
  due_date: number
  is_active: boolean
  last_paid_date: string | null
}

// Helper function to check if Supabase is available
const isSupabaseAvailable = () => {
  return supabase !== null
}

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      // Return mock data for development
      return {
        user: {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString(),
          user_metadata: { name }
        }
      }
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  try {
    // Sign up user without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        },
        emailRedirectTo: undefined // Disable email confirmation
      }
    })

    if (error) {
      console.error('Supabase signup error:', error)
      throw error
    }

    // Insert user data into users table
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ 
          id: data.user.id, 
          name, 
          email 
        }])

      if (insertError) {
        console.error('Error inserting user data:', insertError)
        // Don't throw here as the signup itself was successful
      }
    }

    return data
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      // Return mock data for development
      return {
        user: {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString(),
          user_metadata: { name: 'Mock User' }
        }
      }
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Supabase signin error:', error)
      throw error
    }

    // If we get here but no user, throw an error
    if (!data.user) {
      throw new Error('No user returned from Supabase')
    }

    return data
  } catch (error: any) {
    console.error('Signin error:', error)
    throw error
  }
}

export const signOut = async () => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export const getCurrentUser = async () => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      return null
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Data functions
export const getAccounts = async (userId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      // Return mock data for development
      return [
        { id: '1', name: 'Cash', type: 'cash' as const, balance: 5000000, currency: 'IDR' },
        { id: '2', name: 'Bank Account', type: 'bank' as const, balance: 15000000, currency: 'IDR' },
        { id: '3', name: 'Credit Card', type: 'credit' as const, balance: -2000000, currency: 'IDR' },
      ]
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return data.map(account => ({
    ...account,
    type: account.type as 'cash' | 'bank' | 'credit' | 'investment'
  })) as Account[]
}

export const addAccount = async (userId: string, account: Omit<Account, 'id'>) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Validate that the required fields are provided
  if (!account.name || !account.type) {
    throw new Error('Missing required account fields');
  }

  // Validate account type
  const validTypes = ['cash', 'bank', 'credit', 'investment'];
  if (!validTypes.includes(account.type)) {
    throw new Error(`Invalid account type: ${account.type}`);
  }

  // Convert the account data to match the database schema
  const dbAccount = {
    user_id: userId,
    name: account.name,
    type: account.type,
    balance: account.balance || 0,
    currency: account.currency || 'IDR'
  };

  const { data, error } = await supabase
    .from('accounts')
    .insert([dbAccount])
    .select() // This will return the inserted record with its generated ID

  if (error) {
    console.error('Error adding account:', error);
    throw error;
  }

  return data;
}

export const updateAccount = async (account: Account) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Convert the account data to match the database schema
  const dbAccount = {
    name: account.name,
    type: account.type,
    balance: account.balance,
    currency: account.currency
  };

  const { error } = await supabase
    .from('accounts')
    .update(dbAccount)
    .eq('id', account.id)

  if (error) {
    console.error('Error updating account:', error)
    throw error
  }
}

export const deleteAccount = async (accountId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId)

  if (error) {
    console.error('Error deleting account:', error)
    throw error
  }
}

export const getTransactions = async (userId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      // Return mock data for development
      return [
        { 
          id: '1', 
          accountId: '1', 
          categoryId: '1', 
          amount: 5000000, 
          description: 'Monthly Salary', 
          date: '2025-09-01', 
          type: 'income' as const, 
          createdAt: '2025-09-01T09:00:00Z' 
        },
        { 
          id: '2', 
          accountId: '1', 
          categoryId: '3', 
          amount: 1500000, 
          description: 'Grocery Shopping', 
          date: '2025-09-05', 
          type: 'expense' as const, 
          createdAt: '2025-09-05T18:30:00Z' 
        },
        { 
          id: '3', 
          accountId: '1', 
          categoryId: '4', 
          amount: 300000, 
          description: 'Gasoline', 
          date: '2025-09-10', 
          type: 'expense' as const, 
          createdAt: '2025-09-10T08:15:00Z' 
        },
        { 
          id: '4', 
          accountId: '2', 
          categoryId: '2', 
          amount: 2000000, 
          description: 'Freelance Project', 
          date: '2025-09-15', 
          type: 'income' as const, 
          createdAt: '2025-09-15T14:20:00Z' 
        },
      ]
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) {
    throw error
  }

  return data.map(transaction => ({
    ...transaction,
    type: transaction.type as 'income' | 'expense'
  })) as Transaction[]
}

export const addTransaction = async (userId: string, transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Validate that the required fields are provided and are valid
  if (!transaction.accountId || !transaction.categoryId || !transaction.amount || !transaction.date || !transaction.type) {
    throw new Error('Missing required transaction fields');
  }

  // Validate UUID format for accountId and categoryId
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(transaction.accountId)) {
    throw new Error(`Invalid accountId format: ${transaction.accountId}`);
  }
  
  if (!uuidRegex.test(transaction.categoryId)) {
    throw new Error(`Invalid categoryId format: ${transaction.categoryId}`);
  }

  // Validate transaction type
  if (transaction.type !== 'income' && transaction.type !== 'expense') {
    throw new Error(`Invalid transaction type: ${transaction.type}`);
  }

  // Validate amount is positive
  if (transaction.amount <= 0) {
    throw new Error(`Transaction amount must be positive: ${transaction.amount}`);
  }

  // Convert the transaction data to match the database schema
  const dbTransaction = {
    user_id: userId,
    account_id: transaction.accountId,
    category_id: transaction.categoryId,
    amount: transaction.amount,
    description: transaction.description || '',
    date: transaction.date,
    type: transaction.type,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert([dbTransaction])
    .select() // This will return the inserted record with its generated ID

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return data;
}

export const deleteTransaction = async (transactionId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)

  if (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}

export const getBudgets = async (userId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      // Return mock data for development
      return [
        { 
          id: '1', 
          categoryId: '3', 
          amount: 2000000, 
          period: 'monthly' as const, 
          startDate: '2025-09-01', 
          endDate: '2025-09-30' 
        },
        { 
          id: '2', 
          categoryId: '4', 
          amount: 500000, 
          period: 'monthly' as const, 
          startDate: '2025-09-01', 
          endDate: '2025-09-30' 
        },
      ]
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return data.map(budget => ({
    ...budget,
    period: budget.period as 'weekly' | 'monthly' | 'yearly',
    startDate: budget.start_date,
    endDate: budget.end_date
  })) as Budget[]
}

export const addBudget = async (userId: string, budget: Omit<Budget, 'id'>) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Validate that the required fields are provided and are valid
  if (!budget.categoryId || !budget.amount || !budget.period || !budget.startDate || !budget.endDate) {
    throw new Error('Missing required budget fields');
  }

  // Validate UUID format for categoryId
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(budget.categoryId)) {
    throw new Error(`Invalid categoryId format: ${budget.categoryId}`);
  }

  // Validate budget period
  const validPeriods = ['weekly', 'monthly', 'yearly'];
  if (!validPeriods.includes(budget.period)) {
    throw new Error(`Invalid budget period: ${budget.period}`);
  }

  // Validate amount is positive
  if (budget.amount <= 0) {
    throw new Error(`Budget amount must be positive: ${budget.amount}`);
  }

  // Validate dates
  if (new Date(budget.startDate) > new Date(budget.endDate)) {
    throw new Error('Budget start date must be before end date');
  }

  // Convert the budget data to match the database schema
  const dbBudget = {
    user_id: userId,
    category_id: budget.categoryId,
    amount: budget.amount,
    period: budget.period,
    start_date: budget.startDate,
    end_date: budget.endDate,
  };

  const { data, error } = await supabase
    .from('budgets')
    .insert([dbBudget])
    .select() // This will return the inserted record with its generated ID

  if (error) {
    console.error('Error adding budget:', error);
    throw error;
  }

  return data;
}

export const getBills = async (userId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      // Return mock data for development
      return [
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
      ]
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return data.map(bill => ({
    ...bill,
    dueDate: bill.due_date,
    isActive: bill.is_active,
    lastPaidDate: bill.last_paid_date || undefined
  })) as Bill[]
}

export const addBill = async (userId: string, bill: Omit<Bill, 'id'>) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Validate that the required fields are provided and are valid
  if (!bill.name || !bill.amount || !bill.dueDate || !bill.accountId || !bill.categoryId) {
    throw new Error('Missing required bill fields');
  }

  // Validate UUID format for accountId and categoryId
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(bill.accountId)) {
    throw new Error(`Invalid accountId format: ${bill.accountId}`);
  }
  
  if (!uuidRegex.test(bill.categoryId)) {
    throw new Error(`Invalid categoryId format: ${bill.categoryId}`);
  }

  // Convert the bill data to match the database schema
  const dbBill = {
    user_id: userId,
    name: bill.name,
    amount: bill.amount,
    due_date: bill.dueDate,
    account_id: bill.accountId,
    category_id: bill.categoryId,
    is_active: bill.isActive,
    last_paid_date: bill.lastPaidDate || null,
  };

  const { data, error } = await supabase
    .from('bills')
    .insert([dbBill])
    .select() // This will return the inserted record with its generated ID

  if (error) {
    console.error('Error adding bill:', error);
    throw error;
  }

  return data;
};

export const updateBill = async (bill: Bill) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Validate that the required fields are provided and are valid
  if (!bill.id || !bill.name || !bill.amount || !bill.dueDate || !bill.accountId || !bill.categoryId) {
    throw new Error('Missing required bill fields');
  }

  // Validate UUID format for id, accountId and categoryId
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(bill.id)) {
    throw new Error(`Invalid bill id format: ${bill.id}`);
  }
  
  if (!uuidRegex.test(bill.accountId)) {
    throw new Error(`Invalid accountId format: ${bill.accountId}`);
  }
  
  if (!uuidRegex.test(bill.categoryId)) {
    throw new Error(`Invalid categoryId format: ${bill.categoryId}`);
  }

  // Convert the bill data to match the database schema
  const dbBill = {
    name: bill.name,
    amount: bill.amount,
    due_date: bill.dueDate,
    account_id: bill.accountId,
    category_id: bill.categoryId,
    is_active: bill.isActive,
    last_paid_date: bill.lastPaidDate || null,
  };

  const { error } = await supabase
    .from('bills')
    .update(dbBill)
    .eq('id', bill.id)

  if (error) {
    console.error('Error updating bill:', error);
    throw error;
  }
}

export const deleteBill = async (billId: string) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.')
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('id', billId)

  if (error) {
    console.error('Error deleting bill:', error)
    throw error
  }
}

// Add Category function
export const addCategory = async (userId: string, category: Omit<Category, 'id'>) => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      return
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }
  }

  // Validate that the required fields are provided
  if (!category.name || !category.type) {
    throw new Error('Missing required category fields');
  }

  // Validate category type
  if (category.type !== 'income' && category.type !== 'expense') {
    throw new Error(`Invalid category type: ${category.type}`);
  }

  // Convert the category data to match the database schema
  const dbCategory = {
    name: category.name,
    type: category.type,
    icon: category.icon || '',
    color: category.color || 'bg-gray-500'
  };

  const { data, error } = await supabase
    .from('categories')
    .insert([dbCategory])
    .select() // This will return the inserted record with its generated ID

  if (error) {
    console.error('Error adding category:', error);
    throw error;
  }

  return data;
}

// Get Categories function (to refresh categories after adding new ones)
export const getCategories = async () => {
  if (!isSupabaseAvailable() || !supabase) {
    // Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Supabase is not configured. Using mock data.');
      // Return mock data for development
      return initialCategories;
    } else {
      // In production, throw an error if Supabase is not available
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    throw error;
  }

  return data as Category[];
}