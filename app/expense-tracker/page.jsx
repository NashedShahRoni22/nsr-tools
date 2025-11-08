"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Trash2,
  Calendar,
  Tag,
  PieChart,
  Filter,
} from "lucide-react";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const categories = [
    {
      id: "food",
      name: "Food & Dining",
      emoji: "🍔",
      color: "bg-orange-100 text-orange-700",
    },
    {
      id: "transport",
      name: "Transportation",
      emoji: "🚗",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "shopping",
      name: "Shopping",
      emoji: "🛍️",
      color: "bg-pink-100 text-pink-700",
    },
    {
      id: "entertainment",
      name: "Entertainment",
      emoji: "🎬",
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: "bills",
      name: "Bills & Utilities",
      emoji: "💡",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "health",
      name: "Healthcare",
      emoji: "🏥",
      color: "bg-red-100 text-red-700",
    },
    {
      id: "education",
      name: "Education",
      emoji: "📚",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      id: "salary",
      name: "Salary",
      emoji: "💰",
      color: "bg-green-100 text-green-700",
    },
    {
      id: "freelance",
      name: "Freelance",
      emoji: "💼",
      color: "bg-teal-100 text-teal-700",
    },
    {
      id: "investment",
      name: "Investment",
      emoji: "📈",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "other",
      name: "Other",
      emoji: "📌",
      color: "bg-gray-100 text-gray-700",
    },
  ];

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount || !description) {
      alert("Please enter amount and description");
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      type,
      date,
      createdAt: new Date().toISOString(),
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setDescription("");
    setCategory("food");
    setType("expense");
    setDate(new Date().toISOString().split("T")[0]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const getCategoryInfo = (categoryId) => {
    return (
      categories.find((cat) => cat.id === categoryId) ||
      categories[categories.length - 1]
    );
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      filterCategory === "all" || expense.category === filterCategory;
    const matchesType = filterType === "all" || expense.type === filterType;
    return matchesCategory && matchesType;
  });

  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryBreakdown = categories
    .map((cat) => {
      const total = expenses
        .filter((e) => e.category === cat.id && e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0);
      return { ...cat, total };
    })
    .filter((cat) => cat.total > 0);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <p className="text-center mb-8 text-xl md:text-3xl font-bold text-gray-800">
          Track your income and expenses effortlessly
        </p>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Income</span>
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Expenses</span>
              <TrendingDown className="text-red-600" size={24} />
            </div>
            <div className="text-3xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-lg border ${
              balance >= 0
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                : "bg-gradient-to-br from-red-500 to-red-600 text-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Balance</span>
              <DollarSign size={24} />
            </div>
            <div className="text-3xl font-bold">
              ${Math.abs(balance).toFixed(2)}
            </div>
            <div className="text-sm mt-1 opacity-90">
              {balance >= 0 ? "Surplus" : "Deficit"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Transaction Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <DollarSign size={24} className="text-green-600" />
                Add Transaction
              </h2>
              <div className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setType("expense")}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      type === "expense"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-red-300"
                    }`}
                  >
                    <TrendingDown size={20} className="inline mr-2" />
                    Expense
                  </button>
                  <button
                    onClick={() => setType("income")}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      type === "income"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                    }`}
                  >
                    <TrendingUp size={20} className="inline mr-2" />
                    Income
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addExpense()}
                    placeholder="Enter description..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addExpense}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    type === "expense"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  <DollarSign size={20} />
                  Add {type === "expense" ? "Expense" : "Income"}
                </button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Transactions
                </h2>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Types</option>
                    <option value="expense">Expenses</option>
                    <option value="income">Income</option>
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Wallet size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No transactions found</p>
                  </div>
                ) : (
                  filteredExpenses.map((expense) => {
                    const catInfo = getCategoryInfo(expense.category);
                    return (
                      <div
                        key={expense.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          expense.type === "income"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${catInfo.color}`}>
                              <span className="text-xl">{catInfo.emoji}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800">
                                {expense.description}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Calendar size={14} />
                                <span>
                                  {new Date(expense.date).toLocaleDateString()}
                                </span>
                                <span className="mx-1">•</span>
                                <Tag size={14} />
                                <span>{catInfo.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div
                              className={`text-xl font-bold ${
                                expense.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {expense.type === "income" ? "+" : "-"}$
                              {expense.amount.toFixed(2)}
                            </div>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <PieChart size={24} className="text-purple-600" />
                Expense Breakdown
              </h2>
              {categoryBreakdown.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No expense data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoryBreakdown.map((cat) => {
                    const percentage = (
                      (cat.total / totalExpenses) *
                      100
                    ).toFixed(1);
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <span>{cat.emoji}</span>
                            {cat.name}
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            ${cat.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${cat.color
                              .split(" ")[0]
                              .replace("100", "500")}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Track every expense for better insights</li>
                <li>• Set a monthly budget for each category</li>
                <li>• Review your spending patterns regularly</li>
                <li>• Save receipts for major purchases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
