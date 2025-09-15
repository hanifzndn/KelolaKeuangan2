'use client';

import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AboutPage() {
  return (
    <ProtectedRoute>
      <AboutContent />
    </ProtectedRoute>
  );
}

function AboutContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-light sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tentang Dompet Keluarga</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="card shadow-heavy mb-8">
            <div className="card-body">
              <div className="text-center mb-8">
                <div className="mx-auto bg-blue-500 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dompet Keluarga</h1>
                <p className="text-gray-600">Aplikasi Pengelolaan Keuangan Pribadi</p>
              </div>

              <div className="prose prose-blue max-w-none">
                <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tentang Aplikasi
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Dompet Keluarga adalah aplikasi yang dirancang untuk membantu Anda mengelola keuangan pribadi dan keluarga 
                    dengan lebih efektif. Aplikasi ini memungkinkan Anda untuk mencatat pendapatan dan pengeluaran, membuat anggaran, 
                    serta memantau kondisi keuangan Anda secara keseluruhan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Fitur Utama
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Pencatatan pendapatan dan pengeluaran</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Pembuatan dan pengelolaan anggaran per kategori</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Dashboard keuangan dengan ringkasan informasi</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Laporan pengeluaran berdasarkan kategori</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Teknologi Modern
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Antarmuka yang mudah digunakan dan ramah pengguna</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Dapat diinstal sebagai aplikasi PWA (Progressive Web App)</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Bekerja offline setelah kunjungan pertama</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">Keamanan data dengan autentikasi pengguna</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="card mb-8">
                  <div className="card-body">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Cara Menggunakan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex">
                        <div className="mr-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">1</span>
                        </div>
                        <p className="text-gray-700">Mulai dengan mencatat semua pendapatan dan pengeluaran Anda di tab Transaksi</p>
                      </div>
                      <div className="flex">
                        <div className="mr-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">2</span>
                        </div>
                        <p className="text-gray-700">Buat anggaran untuk setiap kategori pengeluaran di tab Anggaran</p>
                      </div>
                      <div className="flex">
                        <div className="mr-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">3</span>
                        </div>
                        <p className="text-gray-700">Pantau kondisi keuangan Anda melalui dashboard</p>
                      </div>
                      <div className="flex">
                        <div className="mr-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">4</span>
                        </div>
                        <p className="text-gray-700">Gunakan laporan untuk menganalisis pola pengeluaran Anda</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Tentang Pengembang
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <p className="text-gray-700">
                        Aplikasi ini dikembangkan sebagai bagian dari proyek akademik dalam rangka memenuhi tugas mata kuliah 
                        Semester 7. Tujuan dari pengembangan aplikasi ini adalah untuk memberikan solusi sederhana namun efektif 
                        dalam mengelola keuangan sehari-hari.
                      </p>
                      <div className="mt-4 flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">Muhammad Hanif</p>
                          <p className="text-gray-600">Developer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="card-body">
                <div className="text-2xl font-bold text-blue-500 mb-1">10+</div>
                <div className="text-sm text-gray-600">Fitur Utama</div>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-body">
                <div className="text-2xl font-bold text-green-500 mb-1">100%</div>
                <div className="text-sm text-gray-600">Open Source</div>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-body">
                <div className="text-2xl font-bold text-purple-500 mb-1">5★</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
            <div className="card text-center">
              <div className="card-body">
                <div className="text-2xl font-bold text-indigo-500 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}