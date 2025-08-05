"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

interface Expense {
  name: string;
  amount: number;
  date: string;
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [shopId, setShopId] = useState('');

  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('currentShop');
    if (!id) {
      router.push('/');
      return;
    }
    setShopId(id);
    const savedExpenses = localStorage.getItem(`expenses-${id}`);
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    if (shopId) {
      localStorage.setItem(`expenses-${shopId}`, JSON.stringify(expenses));
    }
  }, [expenses, shopId]);

  const handleAddExpense = () => {
    const expenseAmount = parseFloat(amount);

    if (!name || isNaN(expenseAmount) || !date) {
      toast.error('Please fill all fields correctly');
      return;
    }

    const newExpense: Expense = {
      name,
      amount: expenseAmount,
      date,
    };

    if (editingIndex !== null) {
      const updated = [...expenses];
      updated[editingIndex] = newExpense;
      setExpenses(updated);
      toast.success('Expense updated successfully');
      setEditingIndex(null);
    } else {
      setExpenses((prev) => [...prev, newExpense]);
      toast.success('Expense added successfully');
    }

    setName('');
    setAmount('');
    setDate('');
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (index: number) => {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
    toast.success('Expense deleted successfully');
  };

  const logout = () => {
    localStorage.removeItem('currentShop');
    router.push('/');
  };

 return (
  <section className="w-full bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-12">
    <div className="max-w-5xl mx-auto">
      <Toaster position="top-right" richColors />

      {/* 🔄 Always show expense form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          {editingIndex !== null ? 'Update Expense' : 'Add New Expense'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-md w-full bg-white/90"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-4 py-2 rounded-md w-full bg-white/90"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-4 py-2 rounded-md w-full bg-white/90"
          />
          <div className="sm:col-span-2">
            <Button onClick={handleAddExpense} className="w-full bg-green-600 text-white hover:bg-green-700">
              {editingIndex !== null ? 'Update Expense' : 'Add Expense'}
            </Button>
          </div>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="overflow-x-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800">Expense List</h2>
          <table className="w-full bg-white rounded-lg shadow text-left min-w-[700px]">
            <thead className="bg-gray-200">
              <tr className="text-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Expense Name</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{e.name}</td>
                  <td className="py-2 px-4 text-red-600">{e.amount.toFixed(2)}</td>
                  <td className="py-2 px-4">{e.date}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <Button onClick={() => handleDeleteExpense(index)} className="bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1">
                        Delete
                      </Button>
                      <Button onClick={() => {
                        const expense = expenses[index];
                        setName(expense.name);
                        setAmount(expense.amount.toString());
                        setDate(expense.date);
                        setEditingIndex(index);
                      }} className="bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-1">
                        Update
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
)}
