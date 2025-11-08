'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  QrCode, 
  CheckSquare, 
  Calculator,
  Image,
  Home,
  Calendar,
  Link2,
  Clock,
  CreditCard,
  FileSpreadsheet,
  Utensils
} from 'lucide-react';

const features = [
  { id: 'invoice', name: 'Invoice Generator', icon: FileText, color: 'text-green-600', path: '/invoice', description: 'Create professional invoices quickly and easily' },
  { id: 'qr', name: 'QR Code Generator', icon: QrCode, color: 'text-purple-600', path: '/qr-code', description: 'Generate QR codes for URLs, text, and more' },
  { id: 'task', name: 'Task Manager', icon: CheckSquare, color: 'text-orange-600', path: '/task-manager', description: 'Organize and track your daily tasks efficiently' },
  { id: 'meal-manager', name: 'Meal Manager', icon: Utensils, color: 'text-green-600', path: '/meal-manager', description: 'Track meals, bazar and balance efficiently' },
//   { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'text-red-600', path: '/calculator', description: 'Perform quick calculations and conversions' },
//   { id: 'image-tools', name: 'Image Tools', icon: Image, color: 'text-pink-600', path: '/image-tools', description: 'Resize, compress, and edit images online' },
//   { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'text-indigo-600', path: '/calendar', description: 'Manage your schedule and appointments' },
  { id: 'url-shortener', name: 'URL Shortener', icon: Link2, color: 'text-cyan-600', path: '/shortener', description: 'Create short, shareable links instantly' },
  { id: 'timer', name: 'Timer & Stopwatch', icon: Clock, color: 'text-yellow-600', path: '/timer', description: 'Track time with timer and stopwatch features' },
  { id: 'expense', name: 'Expense Tracker', icon: CreditCard, color: 'text-emerald-600', path: '/expense-tracker', description: 'Keep track of your expenses and budget' },
  { id: 'spreadsheet', name: 'Mini Spreadsheet', icon: FileSpreadsheet, color: 'text-violet-600', path: '/spreadsheet', description: 'Create simple spreadsheets for quick data' },
];

function getGradient(colorClass) {
  const gradients = {
    'text-green-600': 'from-green-500 to-emerald-600',
    'text-purple-600': 'from-purple-500 to-violet-600',
    'text-orange-600': 'from-orange-500 to-red-600',
    'text-red-600': 'from-red-500 to-pink-600',
    'text-pink-600': 'from-pink-500 to-rose-600',
    'text-indigo-600': 'from-indigo-500 to-blue-600',
    'text-cyan-600': 'from-cyan-500 to-blue-600',
    'text-yellow-600': 'from-yellow-500 to-orange-600',
    'text-emerald-600': 'from-emerald-500 to-teal-600',
    'text-violet-600': 'from-violet-500 to-purple-600',
  };
  return gradients[colorClass] || 'from-blue-500 to-indigo-600';
}

export default function DashboardHome() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to NSR Tools</h2>
        <p className="text-gray-600">Your all-in-one productivity toolkit for daily tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.id}
              href={feature.path}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-left group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getGradient(feature.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.name}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Features</p>
              <p className="text-3xl font-bold text-gray-800">{features.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Home size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <Link href={"/qr-code"} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Most Use</p>
              <p className="text-lg font-semibold text-gray-800">QR Code Scanner</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <QrCode size={24} className="text-green-600" />
            </div>
          </div>
        </Link>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Access</p>
              <p className="text-lg font-semibold text-gray-800">Ready to Use</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckSquare size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}