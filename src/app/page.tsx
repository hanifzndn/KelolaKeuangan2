'use client';

import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { accounts, categories, transactions, budgets, bills, addTransaction, addAccount, addBudget, addCategory, getUpcomingBills } = useFinance();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions' | 'budgets'>('overview');
  
  // Form states
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [categoryId, setCategoryId] = useState(categories.filter(c => c.type === 'expense')[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Custom category states
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryIcon, setCustomCategoryIcon] = useState('📋');

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !accountId || !categoryId) return;
    
    const newTransaction = {
      accountId,
      categoryId,
      amount: parseFloat(amount),
      description,
      date,
      type,
    };
    
    addTransaction(newTransaction);
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleAddCustomCategory = () => {
    if (!customCategoryName) return;
    
    const newCategory = {
      name: customCategoryName,
      type: type, // Use the same type as the transaction
      icon: customCategoryIcon,
      color: type === 'income' ? 'bg-green-500' : 'bg-red-500',
    };
    
    addCategory(newCategory);
    setCustomCategoryName('');
    setShowCustomCategory(false);
    // Set the new category as selected
    // Note: We'll need to refresh the categories to get the new one
  };

  // Calculate financial summary
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate expense by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, { amount: number; category: any }>, transaction) => {
      const category = categories.find(c => c.id === transaction.categoryId);
      if (!acc[transaction.categoryId]) {
        acc[transaction.categoryId] = { amount: 0, category };
      }
      acc[transaction.categoryId].amount += transaction.amount;
      return acc;
    }, {});

  // Get upcoming bills
  const upcomingBills = getUpcomingBills(7);

  // Helper function to get account name
  const getAccountName = (id: string) => {
    const account = accounts.find(acc => acc.id === id);
    return account ? account.name : 'Unknown Account';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-light sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dompet Keluarga</h1>
            <p className="text-sm text-gray-600">Selamat datang, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="btn btn-outline btn-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex overflow-x-auto pb-2 -mx-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Overview
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'accounts'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Akun
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'transactions'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pencatatan Transaksi
          </button>
          <button
            onClick={() => setActiveTab('budgets')}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'budgets'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Anggaran
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Saldo</p>
                      <p className="text-xl font-bold text-gray-900">Rp {totalBalance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pendapatan</p>
                      <p className="text-xl font-bold text-gray-900">Rp {totalIncome.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-red-100 text-red-600 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pengeluaran</p>
                      <p className="text-xl font-bold text-gray-900">Rp {totalExpense.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Bills */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Upcoming Bills (Next 7 Days)</h2>
              </div>
              <div className="card-body">
                {upcomingBills.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-2 text-gray-600">No upcoming bills in the next 7 days</p>
                    <button 
                      onClick={() => router.push('/bills')}
                      className="btn btn-primary mt-4"
                    >
                      Manage Bills
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBills.map((bill) => {
                      const today = new Date();
                      const dueDate = new Date();
                      dueDate.setDate(bill.dueDate);
                      
                      // If the due date has passed this month, set to next month
                      if (dueDate < today) {
                        dueDate.setMonth(dueDate.getMonth() + 1);
                      }
                      
                      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isDueSoon = daysUntilDue <= 3;
                      
                      return (
                        <div key={bill.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${
                              isDueSoon ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{bill.name}</p>
                              <p className="text-sm text-gray-500">
                                Due in {daysUntilDue} days • {getAccountName(bill.accountId)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`font-medium mr-3 ${
                              isDueSoon ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              Rp {bill.amount.toLocaleString()}
                            </span>
                            {isDueSoon && (
                              <span className="badge badge-danger">
                                Due Soon
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => router.push('/bills')}
                        className="btn btn-outline w-full"
                      >
                        View All Bills
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accounts Summary */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Akun Saya</h2>
              </div>
              <div className="card-body">
                {accounts.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <p className="mt-2 text-gray-600">Belum ada akun</p>
                    <button 
                      onClick={() => setActiveTab('accounts')}
                      className="btn btn-primary mt-4"
                    >
                      Tambah Akun
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.map(account => (
                      <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{account.name}</h3>
                            <p className="text-sm text-gray-500 capitalize mt-1">
                              {account.type === 'cash' && 'Cash'}
                              {account.type === 'bank' && 'Bank Account'}
                              {account.type === 'credit' && 'Credit Card'}
                              {account.type === 'investment' && 'Investment'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            account.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.currency}
                          </span>
                        </div>
                        <p className={`text-lg font-bold mt-3 ${
                          account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Rp {account.balance.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Transaksi Terbaru</h2>
                </div>
                <div className="card-body">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 text-gray-600">Belum ada transaksi</p>
                      <button 
                        onClick={() => setActiveTab('transactions')}
                        className="btn btn-primary mt-4"
                      >
                        Tambah Transaksi
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => {
                        const account = accounts.find(a => a.id === transaction.accountId);
                        const category = categories.find(c => c.id === transaction.categoryId);
                        
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-gray-100 text-gray-600 mr-3">
                                {category?.icon}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                <p className="text-sm text-gray-500">{account?.name} • {transaction.date}</p>
                              </div>
                            </div>
                            <div className={`font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Expense by Category */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Pengeluaran per Kategori</h2>
                </div>
                <div className="card-body">
                  {Object.keys(expensesByCategory).length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-2 text-gray-600">Belum ada pengeluaran</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(expensesByCategory).map(([categoryId, data]) => (
                        <div key={categoryId} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gray-100 text-gray-600 mr-3">
                              {data.category?.icon}
                            </div>
                            <span className="font-medium text-gray-900">{data.category?.name}</span>
                          </div>
                          <span className="font-medium text-red-600">Rp {data.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Daftar Akun</h2>
              </div>
              <div className="card-body">
                {accounts.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada akun</h3>
                    <p className="mt-2 text-gray-600">Tambahkan akun pertama Anda untuk memulai</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.map(account => (
                      <div key={account.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{account.name}</h3>
                            <p className="text-sm text-gray-500 capitalize mt-1">
                              {account.type === 'cash' && 'Cash'}
                              {account.type === 'bank' && 'Bank Account'}
                              {account.type === 'credit' && 'Credit Card'}
                              {account.type === 'investment' && 'Investment'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            account.balance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {account.currency}
                          </span>
                        </div>
                        <p className={`text-2xl font-bold mt-4 ${
                          account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Rp {account.balance.toLocaleString()}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">ID: {account.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Add Transaction Form */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Pencatatan Transaksi</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Deskripsi</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-input"
                      placeholder="Contoh: Belanja bulanan"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Jumlah</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="form-input"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Tipe</label>
                    <select
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value as 'income' | 'expense');
                        // Reset category when type changes
                        setCategoryId('');
                      }}
                      className="form-select"
                    >
                      <option value="income">Pendapatan</option>
                      <option value="expense">Pengeluaran</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Akun</label>
                    <select
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Pilih Akun</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Kategori</label>
                    <div className="flex space-x-2">
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="form-select flex-grow"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {categories
                          .filter(category => category.type === type)
                          .map(category => (
                            <option key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCustomCategory(!showCustomCategory)}
                        className="btn btn-outline"
                        title="Tambah Kategori Baru"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Custom Category Form */}
                    {showCustomCategory && (
                      <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-medium text-gray-800 mb-2">Tambah Kategori Baru</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="form-label text-sm">Nama Kategori</label>
                            <input
                              type="text"
                              value={customCategoryName}
                              onChange={(e) => setCustomCategoryName(e.target.value)}
                              className="form-input text-sm"
                              placeholder="Contoh: Investasi"
                              required
                            />
                          </div>
                          <div>
                            <label className="form-label text-sm">Icon</label>
                            <select
                              value={customCategoryIcon}
                              onChange={(e) => setCustomCategoryIcon(e.target.value)}
                              className="form-select text-sm"
                            >
                              <option value="📋">📋 Clipboard</option>
                              <option value="🏠">🏠 Home</option>
                              <option value="🚗">🚗 Car</option>
                              <option value="🛒">🛒 Shopping</option>
                              <option value="🎮">🎮 Gaming</option>
                              <option value="📚">📚 Education</option>
                              <option value="🏥">🏥 Health</option>
                              <option value="🎬">🎬 Entertainment</option>
                              <option value="✈️">✈️ Travel</option>
                              <option value="🍽️">🍽️ Dining</option>
                              <option value="💼">💼 Business</option>
                              <option value="🎨">🎨 Art</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button
                            type="button"
                            onClick={handleAddCustomCategory}
                            className="btn btn-primary btn-sm"
                          >
                            Tambah Kategori
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCustomCategory(false)}
                            className="btn btn-outline btn-sm"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Tanggal</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="btn btn-primary w-full md:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambah Transaksi
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Transaction List */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Semua Transaksi</h2>
              </div>
              <div className="card-body">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada transaksi</h3>
                    <p className="mt-2 text-gray-600">Tambahkan transaksi pertama Anda</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-head">Tanggal</th>
                          <th className="table-head">Deskripsi</th>
                          <th className="table-head">Akun</th>
                          <th className="table-head">Kategori</th>
                          <th className="table-head text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[...transactions]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((transaction) => {
                            const account = accounts.find(a => a.id === transaction.accountId);
                            const category = categories.find(c => c.id === transaction.categoryId);
                            
                            return (
                              <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="table-cell text-gray-500">{transaction.date}</td>
                                <td className="table-cell">
                                  <div className="font-medium text-gray-900">{transaction.description}</div>
                                </td>
                                <td className="table-cell text-gray-500">{account?.name}</td>
                                <td className="table-cell">
                                  <div className="flex items-center">
                                    <span className="mr-2">{category?.icon}</span>
                                    <span>{category?.name}</span>
                                  </div>
                                </td>
                                <td className={`table-cell text-right font-medium ${
                                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            {/* Budget List */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Anggaran</h2>
              </div>
              <div className="card-body">
                {budgets.length === 0 ? (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada anggaran</h3>
                    <p className="mt-2 text-gray-600">Buat anggaran pertama Anda untuk mengelola pengeluaran</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-head">Kategori</th>
                          <th className="table-head">Anggaran</th>
                          <th className="table-head">Terpakai</th>
                          <th className="table-head">Sisa</th>
                          <th className="table-head">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {budgets.map((budget) => {
                          const category = categories.find(c => c.id === budget.categoryId);
                          const spent = transactions
                            .filter(t => t.categoryId === budget.categoryId && t.type === 'expense')
                            .reduce((sum, transaction) => sum + transaction.amount, 0);
                          const remaining = budget.amount - spent;
                          const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                          
                          return (
                            <tr key={budget.id} className="hover:bg-gray-50">
                              <td className="table-cell">
                                <div className="flex items-center">
                                  <span className="mr-2">{category?.icon}</span>
                                  <span className="font-medium text-gray-900">{category?.name}</span>
                                </div>
                              </td>
                              <td className="table-cell text-gray-600">Rp {budget.amount.toLocaleString()}</td>
                              <td className="table-cell text-gray-600">Rp {spent.toLocaleString()}</td>
                              <td className={`table-cell font-medium ${
                                remaining >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                Rp {remaining.toLocaleString()}
                              </td>
                              <td className="table-cell">
                                <div className="w-full">
                                  <div className="progress-bar">
                                    <div 
                                      className={`progress-fill ${
                                        percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`} 
                                      style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}