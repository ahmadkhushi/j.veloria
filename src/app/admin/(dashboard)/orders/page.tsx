'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, RefreshCw, CheckCircle, Clock, Truck, XCircle, AlertCircle } from 'lucide-react';

interface OrderItem {
  id: number;
  orderRef: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  status: string;
  total: number;
  items: any;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SHIPPED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'PROCESSING':
      case 'PLACED':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'CANCELLED':
      case 'RETURNED':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-emerald-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wide uppercase text-white">
              Customer Orders Manager
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track customer purchases, shipping addresses, and update fulfillment statuses.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Orders
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0A192F] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading orders list...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-slate-400 font-semibold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer Info</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      {o.orderRef}
                      <div className="text-[10px] text-slate-500 font-normal">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-slate-400 text-[11px]">{o.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-300 truncate">{o.address}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{o.city}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">Rs. {o.total.toLocaleString()}</div>
                      <div className="text-[10px] uppercase text-slate-400">{o.paymentMethod}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${getStatusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-[#020C1B] border border-white/20 text-xs text-white p-1.5 focus:outline-none rounded"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PLACED">PLACED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="RETURNED">RETURNED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
