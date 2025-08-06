'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'

interface Expense {
  id: string
  name: string
  amount: number
  date: string
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const router = useRouter()

  const fetchExpenses = async () => {
    const user = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.data.user?.id)
      .order('date', { ascending: false })

    if (error) {
      toast.error('Failed to load expenses')
      console.error(error)
    } else {
      setExpenses(data as Expense[])
    }
  }

  const handleAddOrUpdate = async () => {
    const user = await supabase.auth.getUser()
    const userId = user.data.user?.id

    const expenseAmount = parseFloat(amount)
    if (!name || isNaN(expenseAmount) || !date) {
      toast.error('Please fill all fields correctly')
      return
    }

    if (editingId) {
      // ✏️ Update
      const { error } = await supabase
        .from('expenses')
        .update({ name, amount: expenseAmount, date })
        .eq('id', editingId)
        .eq('user_id', userId)

      if (error) {
        toast.error('Failed to update expense')
        return
      }

      toast.success('Expense updated')
      setEditingId(null)
    } else {
      // ➕ Insert
      const { error } = await supabase.from('expenses').insert([
        {
          name,
          amount: expenseAmount,
          date,
          user_id: userId
        }
      ])

      if (error) {
        toast.error('Failed to add expense')
        return
      }

      toast.success('Expense added')
    }

    setName('')
    setAmount('')
    setDate('')
    fetchExpenses()
  }

  const handleDelete = async (id: string) => {
    const user = await supabase.auth.getUser()

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.data.user?.id)

    if (error) {
      toast.error('Delete failed')
    } else {
      toast.success('Deleted')
      fetchExpenses()
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  return (
    <section className="w-full bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Toaster position="top-right" richColors />

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            {editingId ? 'Update Expense' : 'Add New Expense'}
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
              <Button
                onClick={handleAddOrUpdate}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {editingId ? 'Update Expense' : 'Add Expense'}
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
                  <tr key={e.id} className="border-t">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{e.name}</td>
                    <td className="py-2 px-4 text-red-600">{e.amount.toFixed(2)}</td>
                    <td className="py-2 px-4">{e.date}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDelete(e.id)}
                          className="bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            setName(e.name)
                            setAmount(e.amount.toString())
                            setDate(e.date)
                            setEditingId(e.id)
                          }}
                          className="bg-green-600 text-white hover:bg-green-700 text-sm px-3 py-1"
                        >
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
  )
}
