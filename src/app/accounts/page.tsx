'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AccountsPage() {
  return (
    <ProtectedRoute>
      <AccountsContent />
    </ProtectedRoute>
  );
}

function AccountsContent() {
  const { accounts, addAccount, updateAccount, deleteAccount, refreshData } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'cash' | 'bank' | 'credit' | 'investment'>('cash');
  const [balance, setBalance] = useState('');

  // Refresh data when component mounts
  useEffect(() => {
    refreshData();
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !balance) return;
    
    const newAccount = {
      name,
      type,
      balance: parseFloat(balance),
      currency: 'IDR',
    };
    
    await addAccount(newAccount);
    await refreshData(); // Refresh data after adding account
    resetForm();
  };

  const handleEditAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAccount || !name || !balance) return;
    
    const updatedAccount = {
      ...editingAccount,
      name,
      type,
      balance: parseFloat(balance),
    };
    
    await updateAccount(updatedAccount);
    await refreshData(); // Refresh data after updating account
    resetForm();
    setShowEditForm(false);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      await deleteAccount(accountId);
      await refreshData(); // Refresh data after deleting account
    }
  };

  const resetForm = () => {
    setName('');
    setType('cash');
    setBalance('');
  };

  const startEditing = (account: any) => {
    setEditingAccount(account);
    setName(account.name);
    setType(account.type);
    setBalance(account.balance.toString());
    setShowEditForm(true);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Akun</h1>
            <p className="text-gray-600 mt-2">Kelola semua akun keuangan Anda</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(!showAddForm);
              setShowEditForm(false);
            }}
            className="btn btn-primary mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {showAddForm ? 'Batal' : 'Tambah Akun'}
          </button>
        </div>

        {/* Add/Edit Account Form */}
        {(showAddForm || showEditForm) && (
          <div className="card mb-8">
            <div className="card-header">
              <h2 className="card-title">{showEditForm ? 'Edit Akun' : 'Tambah Akun Baru'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={showEditForm ? handleEditAccount : handleAddAccount} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Nama Akun</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="Contoh: Rekening BCA"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Tipe Akun</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Account</option>
                    <option value="credit">Credit Card</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Saldo Awal</label>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="form-input"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {showEditForm ? 'Update Akun' : 'Simpan Akun'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Accounts List */}
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
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-primary mt-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Akun
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(account => (
                  <div key={account.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{account.name}</h3>
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
                    <p className={`text-2xl font-bold mt-2 ${
                      account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Rp {account.balance.toLocaleString()}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                      <button
                        onClick={() => startEditing(account)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </div>
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