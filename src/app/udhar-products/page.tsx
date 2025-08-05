"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreditItem {
  person: string;
  item: string;
  amount: number;
}

export default function UdharProducts() {
  const [credits, setCredits] = useState<CreditItem[]>([]);
  const [person, setPerson] = useState("");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentShop, setCurrentShop] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const shop = localStorage.getItem("currentShop");
    if (!shop) {
      router.push("/");
    } else {
      setCurrentShop(shop);
      const savedCredits = localStorage.getItem(`credits-${shop}`);
      if (savedCredits) setCredits(JSON.parse(savedCredits));
    }
  }, [router]);

  useEffect(() => {
    if (currentShop) {
      localStorage.setItem(`credits-${currentShop}`, JSON.stringify(credits));
    }
  }, [credits, currentShop]);

  const handleAddCredit = () => {
    const creditAmount = parseFloat(amount);

    if (!person || !item || isNaN(creditAmount)) {
      toast.error("Please fill all fields correctly");
      return;
    }

    const newCredit: CreditItem = {
      person,
      item,
      amount: creditAmount,
    };

    if (editingIndex !== null) {
      const updated = [...credits];
      updated[editingIndex] = newCredit;
      setCredits(updated);
      toast.success("Udhar updated successfully");
      setEditingIndex(null);
    } else {
      setCredits((prev) => [...prev, newCredit]);
      toast.success("Udhar added successfully");
    }

    setPerson("");
    setItem("");
    setAmount("");
  };

  const handleDeleteCredit = (index: number) => {
    setCredits((prev) => prev.filter((_, i) => i !== index));
    toast.success("Udhar deleted successfully");
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Toaster position="top-right" richColors />

        {/* Always Show Add Udhar Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            {editingIndex !== null ? "Update Udhar" : "Add New Udhar"}
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
                onClick={handleAddCredit}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {editingIndex !== null ? "Update Udhar" : "Add Udhar"}
              </Button>
            </div>
          </div>
        </div>

        {/* Udhar Table */}
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
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{credit.person}</td>
                    <td className="py-2 px-4">{credit.item}</td>
                    <td className="py-2 px-4 text-blue-600">
                      {credit.amount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeleteCredit(index)}
                          className="bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            const currentCredit = credits[index];
                            setPerson(currentCredit.person);
                            setItem(currentCredit.item);
                            setAmount(currentCredit.amount.toString());
                            setEditingIndex(index);
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
  );
}
