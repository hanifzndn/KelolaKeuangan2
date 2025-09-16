'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useFinance } from '../../context/FinanceContext';
import { Bill } from '../../lib/financeData';

export default function BillsPage() {
  return (
    <ProtectedRoute>
      <BillsContent />
    </ProtectedRoute>
  );
}

function BillsContent() {
  const { bills, accounts, categories, addBill, updateBill, deleteBill, payBill, refreshData } = useFinance();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [error, setError] = useState('');

  // Set default account and category when accounts/categories load
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
    
    if (categories.length > 0 && !categoryId) {
      const utilitiesCategory = categories.find(cat => cat.name === 'Utilities');
      if (utilitiesCategory) {
        setCategoryId(utilitiesCategory.id);
      } else {
        // Set to first expense category if Utilities not found
        const expenseCategory = categories.find(cat => cat.type === 'expense');
        if (expenseCategory) {
          setCategoryId(expenseCategory.id);
        }
      }
    }
  }, [accounts, categories, accountId, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !dueDate || !accountId || !categoryId) {
      setError('All fields are required');
      return;
    }
    
    // Validate that accountId and categoryId are valid UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (accountId && !uuidRegex.test(accountId)) {
      setError('Invalid account selection');
      return;
    }
    
    if (categoryId && !uuidRegex.test(categoryId)) {
      setError('Invalid category selection');
      return;
    }
    
    // For adding new bills, don't include the id field
    // For editing bills, include all fields
    if (editingBill) {
      const billData: Bill = {
        id: editingBill.id,
        name,
        amount: parseFloat(amount),
        dueDate: parseInt(dueDate),
        accountId,
        categoryId,
        isActive: true,
      };
      updateBill(billData);
    } else {
      // Omit the id field for new bills
      const billData = {
        name,
        amount: parseFloat(amount),
        dueDate: parseInt(dueDate),
        accountId,
        categoryId,
        isActive: true,
      };
      addBill(billData);
    }
    
    // Reset form
    setName('');
    setAmount('');
    setDueDate('');
    setEditingBill(null);
    setActiveTab('list');
    setError('');
  };

  const handleEdit = (bill: Bill) => {
    setName(bill.name);
    setAmount(bill.amount.toString());
    setDueDate(bill.dueDate.toString());
    setAccountId(bill.accountId);
    setCategoryId(bill.categoryId);
    setEditingBill(bill);
    setActiveTab('add');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      deleteBill(id);
    }
  };

  const handlePayBill = (bill: Bill) => {
    const today = new Date().toISOString().split('T')[0];
    payBill(bill.id, Date.now().toString(), today);
  };

  const getAccountName = (id: string) => {
    const account = accounts.find(acc => acc.id === id);
    return account ? account.name : 'Unknown Account';
  };

  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown Category';
  };

  // Group bills by status
  const activeBills = bills.filter(bill => bill.isActive);
  const inactiveBills = bills.filter(bill => !bill.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-light sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bills Management</h1>
            <p className="text-sm text-gray-600">Manage your monthly bills</p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex overflow-x-auto pb-2 -mx-1">
          <button
            onClick={() => setActiveTab('list')}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'list'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Bill List
          </button>
          <button
            onClick={() => {
              setName('');
              setAmount('');
              setDueDate('');
              // Set default values when opening the form
              if (accounts.length > 0 && !accountId) {
                setAccountId(accounts[0].id);
              }
              if (categories.length > 0 && !categoryId) {
                const utilitiesCategory = categories.find(cat => cat.name === 'Utilities');
                if (utilitiesCategory) {
                  setCategoryId(utilitiesCategory.id);
                } else {
                  const expenseCategory = categories.find(cat => cat.type === 'expense');
                  if (expenseCategory) {
                    setCategoryId(expenseCategory.id);
                  }
                }
              }
              setEditingBill(null);
              setError('');
              setActiveTab('add');
            }}
            className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'add'
                ? 'bg-blue-500 text-white shadow-medium'
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-light'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {editingBill ? 'Edit Bill' : 'Add Bill'}
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-8">
        {/* Bill List Tab */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Active Bills */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Active Bills</h2>
              </div>
              <div className="card-body">
                {activeBills.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-2 text-gray-600">No active bills found</p>
                    <button 
                      onClick={() => setActiveTab('add')}
                      className="btn btn-primary mt-4"
                    >
                      Add Your First Bill
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-head">Bill Name</th>
                          <th className="table-head">Amount</th>
                          <th className="table-head">Due Date</th>
                          <th className="table-head">Account</th>
                          <th className="table-head">Category</th>
                          <th className="table-head">Last Paid</th>
                          <th className="table-head text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {activeBills.map((bill) => (
                          <tr key={bill.id} className="hover:bg-gray-50">
                            <td className="table-cell">
                              <div className="font-medium text-gray-900">{bill.name}</div>
                            </td>
                            <td className="table-cell text-gray-600">Rp {bill.amount.toLocaleString()}</td>
                            <td className="table-cell text-gray-600">Every {bill.dueDate}{getDaySuffix(bill.dueDate)}</td>
                            <td className="table-cell text-gray-600">{getAccountName(bill.accountId)}</td>
                            <td className="table-cell text-gray-600">{getCategoryName(bill.categoryId)}</td>
                            <td className="table-cell text-gray-600">
                              {bill.lastPaidDate ? new Date(bill.lastPaidDate).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="table-cell text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handlePayBill(bill)}
                                  className="btn btn-secondary btn-sm"
                                >
                                  Pay
                                </button>
                                <button
                                  onClick={() => handleEdit(bill)}
                                  className="btn btn-outline btn-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(bill.id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Inactive Bills */}
            {inactiveBills.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Inactive Bills</h2>
                </div>
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead className="table-header">
                        <tr>
                          <th className="table-head">Bill Name</th>
                          <th className="table-head">Amount</th>
                          <th className="table-head">Due Date</th>
                          <th className="table-head">Account</th>
                          <th className="table-head">Category</th>
                          <th className="table-head text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {inactiveBills.map((bill) => (
                          <tr key={bill.id} className="hover:bg-gray-50">
                            <td className="table-cell">
                              <div className="font-medium text-gray-900">{bill.name}</div>
                            </td>
                            <td className="table-cell text-gray-600">Rp {bill.amount.toLocaleString()}</td>
                            <td className="table-cell text-gray-600">Every {bill.dueDate}{getDaySuffix(bill.dueDate)}</td>
                            <td className="table-cell text-gray-600">{getAccountName(bill.accountId)}</td>
                            <td className="table-cell text-gray-600">{getCategoryName(bill.categoryId)}</td>
                            <td className="table-cell text-right">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(bill)}
                                  className="btn btn-outline btn-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(bill.id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Bill Tab */}
        {activeTab === 'add' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{editingBill ? 'Edit Bill' : 'Add New Bill'} </h2>
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
                <div>
                  <label className="form-label">Bill Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="&nbsp;&nbsp;e.g., Electricity Bill"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Amount (IDR)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="form-input"
                      placeholder="&nbsp;&nbsp;0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Due Date (Day of Month)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="form-input"
                      placeholder="&nbsp;&nbsp;e.g., 10"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Account</label>
                    <select
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select an account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories
                        .filter(category => category.type === 'expense')
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('list');
                      setEditingBill(null);
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingBill ? 'Update Bill' : 'Add Bill'}
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

// Helper function to get day suffix (st, nd, rd, th)
function getDaySuffix(day: number) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}