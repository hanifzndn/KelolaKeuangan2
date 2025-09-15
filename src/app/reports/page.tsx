'use client';

import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsContent />
    </ProtectedRoute>
  );
}

function ReportsContent() {
  const { accounts, categories, transactions } = useFinance();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate totals
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Filter transactions by time range
  const filterTransactionsByTime = (transactions: any[]) => {
    const now = new Date();
    const startDate = new Date();
    
    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const filteredTransactions = filterTransactionsByTime(transactions);
  
  const incomeByCategory = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc: Record<string, number>, transaction) => {
      acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + transaction.amount;
      return acc;
    }, {});

  const expenseByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction) => {
      acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + transaction.amount;
      return acc;
    }, {});

  // Top spending categories
  const topSpendingCategories = Object.entries(expenseByCategory)
    .map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return { category, amount };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
            <p className="text-gray-600 mt-2">Analisis keuangan Anda berdasarkan periode</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === 'week'
                  ? 'bg-blue-500 text-white shadow-medium'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
              }`}
            >
              Minggu
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === 'month'
                  ? 'bg-blue-500 text-white shadow-medium'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
              }`}
            >
              Bulan
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === 'year'
                  ? 'bg-blue-500 text-white shadow-medium'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
              }`}
            >
              Tahun
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income by Category */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Pendapatan per Kategori</h2>
            </div>
            <div className="card-body">
              {Object.keys(incomeByCategory).length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                  </svg>
                  <p className="mt-2 text-gray-600">Tidak ada data pendapatan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(incomeByCategory).map(([categoryId, amount]) => {
                    const category = categories.find(c => c.id === categoryId);
                    const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                    
                    return (
                      <div key={categoryId}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <span className="mr-2">{category?.icon}</span>
                            <span className="font-medium text-gray-900">{category?.name}</span>
                          </div>
                          <span className="text-gray-700">Rp {amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill bg-green-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Pengeluaran per Kategori</h2>
            </div>
            <div className="card-body">
              {Object.keys(expenseByCategory).length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                  <p className="mt-2 text-gray-600">Tidak ada data pengeluaran</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(expenseByCategory).map(([categoryId, amount]) => {
                    const category = categories.find(c => c.id === categoryId);
                    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                    
                    return (
                      <div key={categoryId}>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <span className="mr-2">{category?.icon}</span>
                            <span className="font-medium text-gray-900">{category?.name}</span>
                          </div>
                          <span className="text-gray-700">Rp {amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill bg-red-500" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Kategori Pengeluaran Terbesar</h2>
          </div>
          <div className="card-body">
            {topSpendingCategories.length === 0 ? (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                </svg>
                <p className="mt-2 text-gray-600">Tidak ada data pengeluaran</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topSpendingCategories.map((item, index) => (
                  <div key={item.category?.id} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">{item.category?.icon}</div>
                    <h3 className="font-medium text-gray-900">{item.category?.name}</h3>
                    <p className="text-lg font-bold text-red-600 mt-1">Rp {item.amount.toLocaleString()}</p>
                    <div className="text-xs text-gray-500 mt-2">Peringkat #{index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}