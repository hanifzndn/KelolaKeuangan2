-- Supabase Schema for Financial Management Application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cash', 'bank', 'credit', 'investment')),
  balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'IDR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  icon TEXT,
  color TEXT
);

-- Insert default categories
INSERT INTO categories (name, type, icon, color) VALUES
  ('Salary', 'income', '💰', 'bg-green-500'),
  ('Freelance', 'income', '💻', 'bg-green-400'),
  ('Food & Dining', 'expense', '🍔', 'bg-red-500'),
  ('Transportation', 'expense', '🚗', 'bg-blue-500'),
  ('Shopping', 'expense', '🛍️', 'bg-purple-500'),
  ('Entertainment', 'expense', '🎬', 'bg-yellow-500'),
  ('Utilities', 'expense', '💡', 'bg-gray-500'),
  ('Health', 'expense', '🏥', 'bg-red-400');

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  period TEXT CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills table
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date INTEGER CHECK (due_date >= 1 AND due_date <= 31),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_paid_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_due_date ON bills(due_date);

-- RLS (Row Level Security) Policies
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Accounts policies
CREATE POLICY "Users can view their own accounts" ON accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own accounts" ON accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own accounts" ON accounts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own accounts" ON accounts
  FOR DELETE USING (user_id = auth.uid());

-- Categories policies
CREATE POLICY "Users can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Users can insert categories" ON categories
  FOR INSERT WITH CHECK (true);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own transactions" ON transactions
  FOR DELETE USING (user_id = auth.uid());

-- Budgets policies
CREATE POLICY "Users can view their own budgets" ON budgets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own budgets" ON budgets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own budgets" ON budgets
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own budgets" ON budgets
  FOR DELETE USING (user_id = auth.uid());

-- Bills policies
CREATE POLICY "Users can view their own bills" ON bills
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own bills" ON bills
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bills" ON bills
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own bills" ON bills
  FOR DELETE USING (user_id = auth.uid());

-- Grant access to authenticated users
GRANT ALL ON TABLE users TO authenticated;
GRANT ALL ON TABLE accounts TO authenticated;
GRANT ALL ON TABLE categories TO authenticated;
GRANT ALL ON TABLE transactions TO authenticated;
GRANT ALL ON TABLE budgets TO authenticated;
GRANT ALL ON TABLE bills TO authenticated;