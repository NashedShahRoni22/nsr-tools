"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  ShoppingCart,
  Wallet,
  Utensils,
  Calculator,
  Plus,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Save,
} from "lucide-react";

export default function MealManager() {
  const [users, setUsers] = useState([]);
  const [bazarEntries, setBazarEntries] = useState([]);
  const [mealRecords, setMealRecords] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("dashboard");

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [showAddBazar, setShowAddBazar] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingBazar, setEditingBazar] = useState(null);

  // Form states
  const [newUser, setNewUser] = useState({ name: "", phone: "" });
  const [selectedUser, setSelectedUser] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [bazarData, setBazarData] = useState({
    user: "",
    date: "",
    amount: "",
  });

  // Load data from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("mealManager_users");
    const savedBazar = localStorage.getItem("mealManager_bazar");
    const savedMeals = localStorage.getItem("mealManager_meals");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedBazar) setBazarEntries(JSON.parse(savedBazar));
    if (savedMeals) setMealRecords(JSON.parse(savedMeals));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("mealManager_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("mealManager_bazar", JSON.stringify(bazarEntries));
  }, [bazarEntries]);

  useEffect(() => {
    localStorage.setItem("mealManager_meals", JSON.stringify(mealRecords));
  }, [mealRecords]);

  // Add User
  const handleAddUser = () => {
    if (!newUser.name || !newUser.phone) {
      alert("Please fill all fields");
      return;
    }

    if (newUser.phone.length !== 11 || !/^\d+$/.test(newUser.phone)) {
      alert("Please enter valid 11 digit phone number");
      return;
    }

    const user = {
      id: Date.now(),
      name: newUser.name,
      phone: newUser.phone,
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setNewUser({ name: "", phone: "" });
    setShowAddUser(false);
  };

  // Update Balance
  const handleUpdateBalance = () => {
    if (!selectedUser || !balanceAmount) {
      alert("Please select user and enter amount");
      return;
    }

    setUsers(
      users.map((user) =>
        user.id === parseInt(selectedUser)
          ? { ...user, balance: user.balance + parseFloat(balanceAmount) }
          : user
      )
    );

    setSelectedUser("");
    setBalanceAmount("");
    setShowAddBalance(false);
  };

  // Add Bazar Entry
  const handleAddBazar = () => {
    if (!bazarData.user || !bazarData.date || !bazarData.amount) {
      alert("Please fill all fields");
      return;
    }

    const entry = {
      id: editingBazar?.id || Date.now(),
      userId: parseInt(bazarData.user),
      userName: users.find((u) => u.id === parseInt(bazarData.user))?.name,
      date: bazarData.date,
      amount: parseFloat(bazarData.amount),
      createdAt: editingBazar?.createdAt || new Date().toISOString(),
    };

    if (editingBazar) {
      setBazarEntries(
        bazarEntries.map((b) => (b.id === editingBazar.id ? entry : b))
      );
      setEditingBazar(null);
    } else {
      setBazarEntries([...bazarEntries, entry]);
    }

    setBazarData({ user: "", date: "", amount: "" });
    setShowAddBazar(false);
  };

  // Delete Bazar Entry
  const handleDeleteBazar = (id) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setBazarEntries(bazarEntries.filter((b) => b.id !== id));
    }
  };

  // Toggle Meal
  const toggleMeal = (userId, date) => {
    const key = `${currentYear}-${currentMonth + 1}`;
    const dateKey = `${userId}-${date}`;

    setMealRecords((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [dateKey]: !prev[key]?.[dateKey],
      },
    }));
  };

  // Get days in month
  const getDaysInMonth = (month, year) => {
    return new Array(new Date(year, month + 1, 0).getDate())
      .fill(null)
      .map((_, i) => i + 1);
  };

  // Calculate Stats
  const calculateStats = () => {
    const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);

    const currentMonthBazar = bazarEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    const totalBazar = currentMonthBazar.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    const key = `${currentYear}-${currentMonth + 1}`;
    const monthMeals = mealRecords[key] || {};
    const totalMeals = Object.values(monthMeals).filter(Boolean).length;

    const mealRate = totalMeals > 0 ? totalBazar / totalMeals : 0;

    const wallet = totalBalance - totalBazar;

    return { totalBalance, totalBazar, totalMeals, mealRate, wallet };
  };

  const stats = calculateStats();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const monthKey = `${currentYear}-${currentMonth + 1}`;

  // Get user meal count
  const getUserMealCount = (userId) => {
    const monthMeals = mealRecords[monthKey] || {};
    return Object.keys(monthMeals).filter(
      (key) => key.startsWith(`${userId}-`) && monthMeals[key]
    ).length;
  };

  // Get user total cost
  const getUserTotalCost = (userId) => {
    const mealCount = getUserMealCount(userId);
    return (mealCount * stats.mealRate).toFixed(2);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="">
        {/* Header */}
        <p className="mb-8 text-xl md:text-3xl font-bold text-gray-800">
          Track meals, bazar and balance efficiently
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-blue-600">
                  ৳{stats.totalBalance.toFixed(2)}
                </p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bazar</p>
                <p className="text-2xl font-bold text-orange-600">
                  ৳{stats.totalBazar.toFixed(2)}
                </p>
              </div>
              <ShoppingCart className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wallet</p>
                <p className="text-2xl font-bold text-green-600">
                  ৳{stats.wallet.toFixed(2)}
                </p>
              </div>
              <Wallet className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Meals</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalMeals}
                </p>
              </div>
              <Utensils className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meal Rate</p>
                <p className="text-2xl font-bold text-pink-600">
                  ৳{stats.mealRate.toFixed(2)}
                </p>
              </div>
              <Calculator className="text-pink-600" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 font-medium ${
                activeTab === "dashboard"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Users className="inline mr-2" size={18} />
              Users & Balance
            </button>
            <button
              onClick={() => setActiveTab("bazar")}
              className={`px-6 py-3 font-medium ${
                activeTab === "bazar"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <ShoppingCart className="inline mr-2" size={18} />
              Bazar Entries
            </button>
            <button
              onClick={() => setActiveTab("meals")}
              className={`px-6 py-3 font-medium ${
                activeTab === "meals"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <Calendar className="inline mr-2" size={18} />
              Meal Calendar
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-6 py-3 font-medium ${
                activeTab === "summary"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <TrendingUp className="inline mr-2" size={18} />
              Summary
            </button>
          </div>
        </div>

        {/* Users & Balance Tab */}
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Users</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddUser(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add User
                </button>
                <button
                  onClick={() => setShowAddBalance(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <DollarSign size={18} />
                  Update Balance
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-right py-3 px-4">Balance</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        ৳{user.balance.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm("Delete this user?")) {
                              setUsers(users.filter((u) => u.id !== user.id));
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bazar Tab */}
        {activeTab === "bazar" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Bazar Entries</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddBazar(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Bazar
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Amount</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bazarEntries
                    .filter((entry) => {
                      const entryDate = new Date(entry.date);
                      return (
                        entryDate.getMonth() === currentMonth &&
                        entryDate.getFullYear() === currentYear
                      );
                    })
                    .map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          {entry.userName}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-orange-600">
                          ৳{entry.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingBazar(entry);
                                setBazarData({
                                  user: entry.userId.toString(),
                                  date: entry.date,
                                  amount: entry.amount.toString(),
                                });
                                setShowAddBazar(true);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteBazar(entry.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Meals Calendar Tab */}
        {activeTab === "meals" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Meal Calendar</h2>
              <div className="flex gap-2">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="px-4 py-2 border rounded-lg"
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, i) => (
                    <option key={i} value={i}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="px-4 py-2 border rounded-lg"
                >
                  {[2024, 2025, 2026].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                      User
                    </th>
                    {daysInMonth.map((day) => (
                      <th key={day} className="border p-2 min-w-[40px]">
                        {day}
                      </th>
                    ))}
                    <th className="border p-2 bg-yellow-50 font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="border p-2 font-medium sticky left-0 bg-white z-10">
                        {user.name}
                      </td>
                      {daysInMonth.map((day) => {
                        const dateKey = `${user.id}-${day}`;
                        const hasMeal = mealRecords[monthKey]?.[dateKey];
                        return (
                          <td key={day} className="border p-0 text-center">
                            <input
                              type="checkbox"
                              checked={hasMeal || false}
                              onChange={() => toggleMeal(user.id, day)}
                              className="w-5 h-5 cursor-pointer"
                            />
                          </td>
                        );
                      })}
                      <td className="border p-2 text-center font-semibold bg-yellow-50">
                        {getUserMealCount(user.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-right py-3 px-4">Balance</th>
                    <th className="text-right py-3 px-4">Meals</th>
                    <th className="text-right py-3 px-4">Total Cost</th>
                    <th className="text-right py-3 px-4">Due/Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const mealCount = getUserMealCount(user.id);
                    const totalCost = parseFloat(getUserTotalCost(user.id));
                    const due = user.balance - totalCost;

                    return (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{user.name}</td>
                        <td className="py-3 px-4 text-right">
                          ৳{user.balance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">{mealCount}</td>
                        <td className="py-3 px-4 text-right text-orange-600 font-semibold">
                          ৳{totalCost.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold ${
                            due >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ৳{due.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone (11 digits)
                  </label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="01712345678"
                    maxLength={11}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add User
                </button>
                <button
                  onClick={() => {
                    setShowAddUser(false);
                    setNewUser({ name: "", phone: "" });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Balance Modal */}
        {showAddBalance && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Update Balance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Choose user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount to Add
                  </label>
                  <input
                    type="number"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleUpdateBalance}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Update Balance
                </button>
                <button
                  onClick={() => {
                    setShowAddBalance(false);
                    setSelectedUser("");
                    setBalanceAmount("");
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Bazar Modal */}
        {showAddBazar && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {editingBazar ? "Edit" : "Add"} Bazar Entry
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User</label>
                  <select
                    value={bazarData.user}
                    onChange={(e) =>
                      setBazarData({ ...bazarData, user: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Choose user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={bazarData.date}
                    onChange={(e) =>
                      setBazarData({ ...bazarData, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={bazarData.amount}
                    onChange={(e) =>
                      setBazarData({ ...bazarData, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddBazar}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingBazar ? "Update" : "Add"} Entry
                </button>
                <button
                  onClick={() => {
                    setShowAddBazar(false);
                    setBazarData({ user: "", date: "", amount: "" });
                    setEditingBazar(null);
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
