'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  buy_price: number;
  buy_rate: number;
  sell_rate: number;
  total_investment: number;
  total_sell: number;
  profit: number;
}

export default function SellProducts() {
  const supabase = createClientComponentClient(); // ✅ Added this line
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyRate, setBuyRate] = useState('');
  const [sellRate, setSellRate] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.push('/login');
      const uid = data.session.user.id;
      setUserId(uid);
      fetchProducts(uid);
    };
    getUser();
  }, [router]);

  const fetchProducts = async (uid: string) => {
    const { data, error } = await supabase
      .from('sell_products')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) return toast.error('Failed to fetch products');
    setProducts(data as Product[]);
  };

  const handleAddProduct = async () => {
    const qty = parseFloat(buyPrice);
    const buy = parseFloat(buyRate);
    const sell = parseFloat(sellRate);

    if (!name || isNaN(qty) || isNaN(buy) || isNaN(sell)) {
      return toast.error('Fill all fields correctly');
    }

    const totalInvestment = qty * buy;
    const totalSell = qty * sell;
    const profit = totalSell - totalInvestment;

    const payload = {
      user_id: userId!,
      name,
      buy_price: qty,
      buy_rate: buy,
      sell_rate: sell,
      total_investment: totalInvestment,
      total_sell: totalSell,
      profit,
    };

    if (editingProductId) {
      const { error } = await supabase
        .from('sell_products')
        .update(payload)
        .eq('id', editingProductId);

      if (error) return toast.error('Failed to update');
      toast.success('Product updated');
      setEditingProductId(null);
    } else {
      const { error } = await supabase.from('sell_products').insert(payload);
      if (error) return toast.error('Failed to add');
      toast.success('Product added');
    }

    setName('');
    setBuyPrice('');
    setBuyRate('');
    setSellRate('');
    fetchProducts(userId!);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('sell_products').delete().eq('id', id);
    if (error) return toast.error('Failed to delete');
    toast.success('Product deleted');
    fetchProducts(userId!);
  };

  const totalProfit = products.reduce((acc, p) => acc + p.profit, 0);
  const totalInvestment = products.reduce((acc, p) => acc + p.total_investment, 0);
  const totalSell = products.reduce((acc, p) => acc + p.total_sell, 0);

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
            {editingProductId ? 'Update' : 'Add'} Product
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
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.buy_price}</td>
                  <td className="px-4 py-2">{p.buy_rate}</td>
                  <td className="px-4 py-2">{p.sell_rate}</td>
                  <td className="px-4 py-2 text-yellow-700">{p.total_investment.toFixed(2)}</td>
                  <td className="px-4 py-2 text-blue-700">{p.total_sell.toFixed(2)}</td>
                  <td className="px-4 py-2 text-green-700 font-bold">{p.profit.toFixed(2)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button className="bg-red-600 hover:bg-red-700 text-white text-sm" onClick={() => handleDelete(p.id)}>Delete</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={() => {
                      setName(p.name);
                      setBuyPrice(p.buy_price.toString());
                      setBuyRate(p.buy_rate.toString());
                      setSellRate(p.sell_rate.toString());
                      setEditingProductId(p.id);
                    }}>Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
