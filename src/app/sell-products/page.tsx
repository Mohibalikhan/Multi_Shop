'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';

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
  const [shopId, setShopId] = useState('');

  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('currentShop');
    if (!id) {
      router.push('/');
      return;
    }
    setShopId(id);
    const savedProducts = localStorage.getItem(`products-${id}`);
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    if (shopId) {
      localStorage.setItem(`products-${shopId}`, JSON.stringify(products));
    }
  }, [products, shopId]);

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
      toast.success('Product updated successfully');
      setEditingIndex(null);
    } else {
      setProducts((prev) => [...prev, newProduct]);
      toast.success('Product added successfully');
    }

    setName('');
    setBuyPrice('');
    setBuyRate('');
    setSellRate('');
  };

  const handleDeleteProduct = (index: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
    toast.success('Product deleted successfully');
  };

  const totalProfit = products.reduce((total, p) => total + p.profit, 0);
  const totalInvestment = products.reduce((total, p) => total + p.totalInvestment, 0);
  const totalSell = products.reduce((total, p) => total + p.totalSell, 0);

  return (
    <section className="w-full bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Toaster position="top-right" richColors />

        {/* Always show add product form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-indigo-800 mb-4">
            {editingIndex !== null ? 'Update Product' : 'Add New Sell Product'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <input
              type="number"
              placeholder="Buying Rate Each"
              value={buyRate}
              onChange={(e) => setBuyRate(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <input
              type="number"
              placeholder="Selling Rate Each"
              value={sellRate}
              onChange={(e) => setSellRate(e.target.value)}
              className="border px-4 py-2 rounded-md w-full bg-white/90"
            />
            <div className="sm:col-span-2">
              <Button
                onClick={handleAddProduct}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {editingIndex !== null ? 'Update Product' : 'Add Sell Product'}
              </Button>
            </div>
          </div>
        </div>

        {/* Product list table */}
        {products.length > 0 && (
          <div className="overflow-x-auto mt-10">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Sell Product List</h2>
            <table className="w-full bg-white rounded-lg shadow text-left min-w-[900px]">
              <thead className="bg-gray-200">
                <tr className="text-gray-700">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Qty</th>
                  <th className="py-2 px-4">Buy Rate</th>
                  <th className="py-2 px-4">Sell Rate</th>
                  <th className="py-2 px-4">Investment</th>
                  <th className="py-2 px-4">Sell</th>
                  <th className="py-2 px-4">Profit</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4">{p.buyPrice}</td>
                    <td className="py-2 px-4">{p.buyRate}</td>
                    <td className="py-2 px-4">{p.sellRate}</td>
                    <td className="py-2 px-4 text-yellow-600">{p.totalInvestment.toFixed(2)}</td>
                    <td className="py-2 px-4 text-blue-600">{p.totalSell.toFixed(2)}</td>
                    <td className="py-2 px-4 text-green-700 font-semibold">{p.profit.toFixed(2)}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeleteProduct(index)}
                          className="bg-red-600 text-white hover:bg-red-700 text-sm px-3 py-1"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            const product = products[index];
                            setName(product.name);
                            setBuyPrice(product.buyPrice.toString());
                            setBuyRate(product.buyRate.toString());
                            setSellRate(product.sellRate.toString());
                            setEditingIndex(index);
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

            {/* Summary section */}
            <div className="mt-4 p-4 bg-gray-300 rounded text-right space-y-1">
              <div>
                <strong className="text-gray-800">Total Investment: </strong>
                <span className="text-yellow-700 font-bold">{totalInvestment.toFixed(2)}</span>
              </div>
              <div>
                <strong className="text-gray-800">Total Sell: </strong>
                <span className="text-blue-700 font-bold">{totalSell.toFixed(2)}</span>
              </div>
              <div>
                <strong className="text-gray-800">Total Profit: </strong>
                <span className="text-green-700 font-bold text-lg">{totalProfit.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
