'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle, Truck, Package, Clock } from 'lucide-react';

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

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-light">Client Orders</span>
        <h1 className="text-3xl font-serif text-white uppercase tracking-wider flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-white" /> Orders & Deliveries
        </h1>
      </div>

      <div className="bg-[#0A192F] border border-white/10 p-6 space-y-4">
        {loading ? (
          <p className="text-xs text-slate-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-slate-400">No client orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#020C1B] text-white uppercase tracking-wider font-serif">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Customer Info</th>
                  <th className="p-3">Items & Selected Sizes</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  let itemsList: any[] = [];
                  try {
                    itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                  } catch (e) {}

                  return (
                    <tr key={order.id} className="hover:bg-white/5">
                      <td className="p-3 font-mono font-bold text-white bg-[#020C1B] border border-white/10">
                        {order.orderRef}
                      </td>
                      <td className="p-3 space-y-0.5">
                        <p className="font-bold text-white">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400">Tel: {order.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{order.address}</p>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 max-w-xs">
                          {itemsList.map((it, idx) => (
                            <div key={idx} className="text-[11px] bg-[#020C1B] p-1.5 border border-white/10">
                              <span className="font-bold text-white">{it.name}</span>
                              <div className="text-slate-400 flex justify-between">
                                <span>Size: <span className="text-white font-bold">{it.selectedSize}</span></span>
                                <span>Qty: {it.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-serif font-bold text-white">${order.total.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-[#020C1B] text-white border border-white/20 text-[10px] font-bold uppercase">
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="bg-[#020C1B] border border-white/20 text-[11px] text-white p-1 focus:outline-none"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
