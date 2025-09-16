'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useFinance } from '../../context/FinanceContext';
import { Budget } from '../../lib/financeData';

export default function BudgetsPage() {
  return (
    <ProtectedRoute>
      <BudgetsContent />
    </ProtectedRoute>
  );
}

function BudgetsContent() {
  const { budgets, categories, transactions, accounts, addBudget } = useFinance();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId || !amount || !period || !startDate || !endDate) {
      setError('All fields are required');
      return;
    }
    
    // Validate UUID format for categoryId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
      setError('Invalid category selection');
      return;
    }
    
    // Validate amount is positive
    const amountValue = parseFloat(amount);
    if (amountValue <= 0) {
      setError('Budget amount must be positive');
      return;
    }
    
    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }
    
    // Check if a budget already exists for this category and period
    const existingBudget = budgets.find(b => 
      b.categoryId === categoryId && 
      b.period === period &&
      new Date(b.startDate) <= new Date(startDate) &&
      new Date(b.endDate) >= new Date(endDate)
    );
    
    if (existingBudget) {
      setError('A budget already exists for this category and period');
      return;
    }
    
    const budgetData = {
      categoryId,
      amount: amountValue,
      period,
      startDate,
      endDate,
    };
    
    addBudget(budgetData);
    
    // Reset form
    setCategoryId('');
    setAmount('');
    setPeriod('monthly');
    setStartDate('');
    setEndDate('');
    setError('');
    setActiveTab('list');
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown Category';
  };

  const getCategoryIcon = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.icon : '📋';
  };

  const getCategoryColor = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.color : 'bg-gray-500';
  };

  // Calculate spent amount for each budget
  const calculateSpent = (budget: Budget) => {
    return transactions
      .filter(t => 
        t.categoryId === budget.categoryId && 
        t.type === 'expense' &&
        new Date(t.date) >= new Date(budget.startDate) &&
        new Date(t.date) <= new Date(budget.endDate)
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  // Get status icon based on budget utilization
  const getBudgetStatusIcon = (percentage: number) => {
    if (percentage <= 50) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else if (percentage <= 75) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-light sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pengelolaan Anggaran
            </h1>
            <p className="text-sm text-gray-600">Kelola anggaran pengeluaran Anda</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex overflow-x-auto pb-2 -mx-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center ${
              activeTab === 'list'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Daftar Anggaran
          </button>
          <button
            onClick={() => {
              // Set default values when opening the form
              const today = new Date();
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
              const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              
              setStartDate(firstDay.toISOString().split('T')[0]);
              setEndDate(lastDay.toISOString().split('T')[0]);
              setError('');
              setActiveTab('add');
            }}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center ${
              activeTab === 'add'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Anggaran
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-8">
        {/* Budget List Tab */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Budget Summary Cards */}
            {budgets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="card-body">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-400 bg-opacity-30 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-blue-100">Total Anggaran</p>
                        <p className="text-xl font-bold">
                          Rp {budgets.reduce((sum, budget) => sum + budget.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="card-body">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-400 bg-opacity-30 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-green-100">Total Terpakai</p>
                        <p className="text-xl font-bold">
                          Rp {budgets.reduce((sum, budget) => sum + calculateSpent(budget), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="card-body">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-purple-400 bg-opacity-30 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-purple-100">Total Kategori</p>
                        <p className="text-xl font-bold">{new Set(budgets.map(b => b.categoryId)).size}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Budget List */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Anggaran
                </h2>
              </div>
              <div className="card-body">
                {budgets.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 rounded-full bg-blue-100 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Belum ada anggaran</h3>
                    <p className="mt-2 text-gray-600">Buat anggaran pertama Anda untuk mengelola pengeluaran</p>
                    <button 
                      onClick={() => setActiveTab('add')}
                      className="btn btn-primary mt-4 flex items-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambah Anggaran
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {budgets.map((budget) => {
                      const spent = calculateSpent(budget);
                      const remaining = budget.amount - spent;
                      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                      
                      return (
                        <div key={budget.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex items-center mb-3 md:mb-0">
                              <div className={`p-3 rounded-lg mr-4 ${getCategoryColor(budget.categoryId)}`}>
                                <span className="text-white text-xl">{getCategoryIcon(budget.categoryId)}</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 flex items-center">
                                  {getCategoryName(budget.categoryId)}
                                  <span className="ml-2">{getBudgetStatusIcon(percentage)}</span>
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:items-end">
                              <div className="flex items-center mb-2">
                                <span className="text-lg font-bold text-gray-900 mr-2">Rp {budget.amount.toLocaleString()}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  percentage <= 50 ? 'bg-green-100 text-green-800' : 
                                  percentage <= 75 ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {percentage.toFixed(1)}%
                                </span>
                              </div>
                              
                              <div className="w-full md:w-48 mb-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${
                                      percentage <= 50 ? 'bg-green-500' : 
                                      percentage <= 75 ? 'bg-yellow-500' : 
                                      'bg-red-500'
                                    }`} 
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between w-full md:w-48 text-sm">
                                <span className="text-gray-600">Terpakai: Rp {spent.toLocaleString()}</span>
                                <span className={`font-medium ${
                                  remaining >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  Sisa: Rp {remaining.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Budget Tab */}
        {activeTab === 'add' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Anggaran Baru
              </h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Kategori
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Pilih kategori</option>
                      {categories
                        .filter(category => category.type === 'expense')
                        .map(category => (
                          <option key={category.id} value={category.id} className="flex items-center">
                            <span className="mr-2">{category.icon}</span> {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Jumlah Anggaran (IDR)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="form-input pl-10"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="form-label flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Periode
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                      className="form-select"
                      required
                    >
                      <option value="weekly">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Mingguan
                      </option>
                      <option value="monthly">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Bulanan
                      </option>
                      <option value="yearly">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Tahunan
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('list');
                      setError('');
                    }}
                    className="btn btn-outline flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tambah Anggaran
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}