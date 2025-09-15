'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name);
    setIsEditing(false);
    setSuccess('Profil berhasil diperbarui');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Pengguna</h1>
          
          {success && (
            <div className="alert alert-success mb-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{success}</span>
              </div>
            </div>
          )}
          
          <div className="card">
            <div className="card-body">
              <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                <div className="bg-blue-500 rounded-2xl w-20 h-20 flex items-center justify-center text-white text-2xl font-bold mb-4 md:mb-0 md:mr-6">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center md:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input text-2xl font-bold text-gray-900 mb-2 w-full md:w-auto"
                      autoFocus
                    />
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600">{user?.email}</p>
                    </>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Bergabung sejak {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : ''}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Email</label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
                      {user?.email}
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label">Tanggal Bergabung</label>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ''}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  {isEditing ? (
                    <>
                      <button
                        type="submit"
                        onClick={handleUpdateProfile}
                        className="btn btn-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setName(user?.name || '');
                        }}
                        className="btn btn-outline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Batal
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profil
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={logout}
                    className="btn btn-outline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}