'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'

interface CreditItem {
  id: string
  person: string
  item: string
  amount: number
}

export default function UdharProducts() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [credits, setCredits] = useState<CreditItem[]>([])
  const [person, setPerson] = useState('')
  const [item, setItem] = useState('')
  const [amount, setAmount] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchCredits = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      toast.error('User not logged in')
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('udhars')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      toast.error('Failed to load udhaar data')
      return
    }

    setCredits(data as CreditItem[])
  }

  const handleAddOrUpdate = async () => {
    const creditAmount = parseFloat(amount)
    const { data: userData, error: userError } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (userError || !userId) {
      toast.error('User not found')
      return
    }

    if (!person || !item || isNaN(creditAmount)) {
      toast.error('Please fill all fields correctly')
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('udhars')
        .update({ person, item, amount: creditAmount })
        .eq('id', editingId)
        .eq('user_id', userId)

      if (error) {
        toast.error('Failed to update udhaar')
        return
      }

      toast.success('Udhaar updated')
      setEditingId(null)
    } else {
      const { error } = await supabase.from('udhars').insert([
        {
          person,
          item,
          amount: creditAmount,
          user_id: userId
        }
      ])

      if (error) {
        toast.error('Failed to add udhaar')
        return
      }

      toast.success('Udhaar added')
    }

    setPerson('')
    setItem('')
    setAmount('')
    fetchCredits()
  }

  const handleDelete = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      toast.error('User not logged in')
      return
    }

    const { error } = await supabase
      .from('udhars')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      toast.error('Delete failed')
    } else {
      toast.success('Deleted')
      fetchCredits()
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [])

  return (
    <section className="w-full bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Toaster position="top-right" richColors />

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            {editingId ? 'Update Udhar' : 'Add New Udhar'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Person's Name"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <input
              type="text"
              placeholder="Item Given"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <div className="sm:col-span-2">
              <Button
                onClick={handleAddOrUpdate}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingId ? 'Update Udhar' : 'Add Udhar'}
              </Button>
            </div>
          </div>
        </div>

        {credits.length > 0 && (
          <div className="overflow-x-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Udhar List</h2>
            <table className="w-full bg-white rounded-lg shadow text-left min-w-[900px]">
              <thead className="bg-gray-200">
                <tr className="text-gray-700">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Person</th>
                  <th className="py-2 px-4">Item</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {credits.map((credit, index) => (
                  <tr key={credit.id} className="border-t">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{credit.person}</td>
                    <td className="py-2 px-4">{credit.item}</td>
                    <td className="py-2 px-4 text-blue-600">{credit.amount.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDelete(credit.id)}
                          className="bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            setPerson(credit.person)
                            setItem(credit.item)
                            setAmount(credit.amount.toString())
                            setEditingId(credit.id)
                          }}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-sm px-3 py-1"
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
