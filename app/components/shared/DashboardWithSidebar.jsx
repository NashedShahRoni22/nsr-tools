"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  QrCode,
  CheckSquare,
  Calculator,
  Image,
  Menu,
  X,
  Home,
  Calendar,
  Link2,
  Clock,
  CreditCard,
  FileSpreadsheet,
} from "lucide-react";

const features = [
  {
    id: "home",
    name: "Dashboard",
    icon: Home,
    color: "text-blue-600",
    path: "/",
  },
  {
    id: "invoice",
    name: "Invoice Generator",
    icon: FileText,
    color: "text-green-600",
    path: "/invoice",
  },
  {
    id: "qr",
    name: "QR Code Generator",
    icon: QrCode,
    color: "text-purple-600",
    path: "/qr-code",
  },
  {
    id: "task",
    name: "Task Manager",
    icon: CheckSquare,
    color: "text-orange-600",
    path: "/task-manager",
  },
  // {
  //   id: "calculator",
  //   name: "Calculator",
  //   icon: Calculator,
  //   color: "text-red-600",
  //   path: "/calculator",
  // },
  // {
  //   id: "image-tools",
  //   name: "Image Tools",
  //   icon: Image,
  //   color: "text-pink-600",
  //   path: "/coming-soon",
  // },
  // {
  //   id: "calendar",
  //   name: "Calendar",
  //   icon: Calendar,
  //   color: "text-indigo-600",
  //   path: "/coming-soon",
  // },
  {
    id: "url-shortener",
    name: "URL Shortener",
    icon: Link2,
    color: "text-cyan-600",
    path: "/shortener",
  },
  {
    id: "timer",
    name: "Timer & Stopwatch",
    icon: Clock,
    color: "text-yellow-600",
    path: "/timer",
  },
  {
    id: "expense",
    name: "Expense Tracker",
    icon: CreditCard,
    color: "text-emerald-600",
    path: "/expense-tracker",
  },
  {
    id: "spreadsheet",
    name: "Mini Spreadsheet",
    icon: FileSpreadsheet,
    color: "text-violet-600",
    path: "/spreadsheet",
  },
];

export default function DashboardWithSidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const currentFeature =
    features.find((f) => f.path === pathname) || features[0];
  const CurrentIcon = currentFeature.icon;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col overflow-hidden fixed md:relative h-full z-50`}
      >
        {/* Logo/Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0">
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-bold text-xl text-gray-800">NSR Tools</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = pathname === feature.path;

              return (
                <Link
                  key={feature.id}
                  href={feature.path}
                  onClick={() => {
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  title={!sidebarOpen ? feature.name : ""}
                >
                  <Icon
                    size={20}
                    className={isActive ? feature.color : "text-gray-500"}
                  />
                  {sidebarOpen && (
                    <span className="text-sm">{feature.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="text-xs text-gray-500 text-center">
              <p className="font-medium">NSR Dev Tools</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <CurrentIcon size={24} className="text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">
                {currentFeature.name}
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <Clock size={16} className="text-gray-600" />
              <div className="text-sm">
                <div className="font-semibold text-gray-800">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="text-xs text-gray-600">
                  {currentTime.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Children will render here */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
