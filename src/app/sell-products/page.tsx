'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Product {
  name: string;
  buyPrice: number;
  buyRate: number;
  sellRate: number;
  totalInvestment: number;
  totalSell: number;
  profit: number;
}

export default function SellProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyRate, setBuyRate] = useState('');
  const [sellRate, setSellRate] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const router = useRouter();

  // ✅ Supabase session check
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  // ✅ You can remove this if you're not using localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sell-products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('sell-products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = () => {
    const qty = parseFloat(buyPrice);
    const buy = parseFloat(buyRate);
    const sell = parseFloat(sellRate);

    if (!name || isNaN(qty) || isNaN(buy) || isNaN(sell)) {
      toast.error('Please fill all fields correctly');
      return;
    }

    const totalInvestment = qty * buy;
    const totalSell = qty * sell;
    const profit = totalSell - totalInvestment;

    const newProduct: Product = {
      name,
      buyPrice: qty,
      buyRate: buy,
      sellRate: sell,
      totalInvestment,
      totalSell,
      profit,
    };

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = newProduct;
      setProducts(updated);
      toast.success('Product updated');
      setEditingIndex(null);
    } else {
      setProducts((prev) => [...prev, newProduct]);
      toast.success('Product added');
    }

    setName('');
    setBuyPrice('');
    setBuyRate('');
    setSellRate('');
  };

  const handleDelete = (i: number) => {
    setProducts((prev) => prev.filter((_, idx) => idx !== i));
    toast.success('Product deleted');
  };

  const totalProfit = products.reduce((acc, p) => acc + p.profit, 0);
  const totalInvestment = products.reduce((acc, p) => acc + p.totalInvestment, 0);
  const totalSell = products.reduce((acc, p) => acc + p.totalSell, 0);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <Toaster position="top-right" richColors />
      <h2 className="text-2xl font-bold mb-4">Sell Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-md shadow">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Qty" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Buy Rate" value={buyRate} onChange={(e) => setBuyRate(e.target.value)} className="border p-2 rounded" />
        <input placeholder="Sell Rate" value={sellRate} onChange={(e) => setSellRate(e.target.value)} className="border p-2 rounded" />
        <div className="col-span-2">
          <Button onClick={handleAddProduct} className="w-full bg-green-600 hover:bg-green-700 text-white">
            {editingIndex !== null ? 'Update' : 'Add'} Product
          </Button>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-8 bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Buy</th>
                <th className="px-4 py-2">Sell</th>
                <th className="px-4 py-2">Investment</th>
                <th className="px-4 py-2">Sell</th>
                <th className="px-4 py-2">Profit</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.buyPrice}</td>
                  <td className="px-4 py-2">{p.buyRate}</td>
                  <td className="px-4 py-2">{p.sellRate}</td>
                  <td className="px-4 py-2 text-yellow-700">{p.totalInvestment.toFixed(2)}</td>
                  <td className="px-4 py-2 text-blue-700">{p.totalSell.toFixed(2)}</td>
                  <td className="px-4 py-2 text-green-700 font-bold">{p.profit.toFixed(2)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white text-sm"
                      onClick={() => handleDelete(i)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      onClick={() => {
                        const product = products[i];
                        setName(product.name);
                        setBuyPrice(product.buyPrice.toString());
                        setBuyRate(product.buyRate.toString());
                        setSellRate(product.sellRate.toString());
                        setEditingIndex(i);
                      }}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="p-4 bg-gray-100 mt-4 rounded-md text-right">
            <p><strong>Total Investment:</strong> <span className="text-yellow-700">{totalInvestment.toFixed(2)}</span></p>
            <p><strong>Total Sell:</strong> <span className="text-blue-700">{totalSell.toFixed(2)}</span></p>
            <p><strong>Total Profit:</strong> <span className="text-green-700">{totalProfit.toFixed(2)}</span></p>
          </div>
        </div>
      )}
    </section>
  );
}
