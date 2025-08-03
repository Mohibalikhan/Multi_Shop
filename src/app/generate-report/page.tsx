"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FinancialSummary {
  totalSales: number;
  totalUdhar: number;
  totalExpenses: number;
  netProfit: number;
}

export default function GenerateReport() {
  const [showReport, setShowReport] = useState(false);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalSales: 0,
    totalUdhar: 0,
    totalExpenses: 0,
    netProfit: 0
  });

  const loadFinancialData = () => {
    try {
      const shopId = localStorage.getItem("currentShop") || "";
      const products = JSON.parse(localStorage.getItem(`products-${shopId}`) || "[]");
      const credits = JSON.parse(localStorage.getItem(`credits-${shopId}`) || "[]");
      const expenses = JSON.parse(localStorage.getItem(`expenses-${shopId}`) || "[]");

      const totalSales = products.reduce((sum: number, p: any) => sum + (p.totalSell || 0), 0);
      const totalUdhar = credits.reduce((sum: number, c: any) => sum + (c.amount || 0), 0);
      const totalExpenses = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
      const netProfit = totalSales - totalExpenses;

      setSummary({
        totalSales,
        totalUdhar,
        totalExpenses,
        netProfit
      });
    } catch (error) {
      toast.error("Error loading financial data");
      console.error(error);
    }
  };

  useEffect(() => {
    loadFinancialData();
  }, []);

  const chartData = {
    labels: ['Total Sales', 'Total Udhar', 'Total Expenses'],
    datasets: [
      {
        label: 'Financial Overview (PKR)',
        data: [summary.totalSales, summary.totalUdhar, summary.totalExpenses],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <section className="w-full bg-gradient-to-br from-gray-100 via-indigo-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <Toaster position="top-right" richColors />

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button 
            onClick={() => {
              setShowReport(true);
              loadFinancialData();
            }} 
            className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto"
          >
            Generate Report
          </Button>
        </div>

        {showReport && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-indigo-800">Business Report</h2>

            {/* Chart Section */}
            <div className="chart-container mb-8" style={{ height: '400px' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: {
                      display: true,
                      text: 'Financial Overview',
                      font: { size: 18 }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `PKR ${context.parsed.y.toFixed(2)}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `PKR ${value}`
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Sales</h3>
                <p className="text-2xl font-bold">PKR {summary.totalSales.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800">Total Udhar</h3>
                <p className="text-2xl font-bold">PKR {summary.totalUdhar.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
                <p className="text-2xl font-bold">PKR {summary.totalExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Net Profit</h3>
                <p className="text-2xl font-bold">PKR {summary.netProfit.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4">
              <Button 
                onClick={() => setShowReport(false)} 
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                Close Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
