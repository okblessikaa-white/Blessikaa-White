import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldCheck,
  Building2,
  FileCheck,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { PharmacyRxOrder, PharmacyInventoryItem } from '../../types';
import { MOCK_PHARMACY_ORDERS, MOCK_PHARMACY_INVENTORY } from '../../data/pharmacyData';
import { soundManager } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';

export const PharmacistWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory'>('queue');
  const [orders, setOrders] = useState<PharmacyRxOrder[]>(MOCK_PHARMACY_ORDERS);
  const [inventory, setInventory] = useState<PharmacyInventoryItem[]>(MOCK_PHARMACY_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateOrderStatus = (orderId: string, newStatus: PharmacyRxOrder['status']) => {
    soundManager.playSuccess();
    triggerHaptic('medium');
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleAdjustStock = (itemId: string, delta: number) => {
    soundManager.playTick();
    triggerHaptic('light');
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, stock: Math.max(0, item.stock + delta) } : item
      )
    );
  };

  return (
    <div className="space-y-5">
      {/* Pharmacist Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl text-white shadow-lg shadow-amber-600/20 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl">
              📦
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                Licensed Pharmacy Workspace
              </span>
              <h2 className="text-lg sm:text-xl font-black">
                Walgreens Pharmacy #4401
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Lead Pharmacist: Marcus Vance, RPh • DEA #VB-499102
              </p>
            </div>
          </div>
        </div>

        {/* Quick Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/20 text-xs">
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-amber-100 text-[10px] uppercase font-bold block">Pending Verification</span>
            <span className="text-base font-black">
              {orders.filter((o) => o.status === 'pending').length} Orders
            </span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-amber-100 text-[10px] uppercase font-bold block">Ready for Pickup</span>
            <span className="text-base font-black">
              {orders.filter((o) => o.status === 'ready').length} Orders
            </span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-amber-100 text-[10px] uppercase font-bold block">FEFO Critical Expiry</span>
            <span className="text-base font-black">1 Batch (&lt;45d)</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-2xl">
            <span className="text-amber-100 text-[10px] uppercase font-bold block">Stock Items Monitored</span>
            <span className="text-base font-black">{inventory.length} Skus</span>
          </div>
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 dark:border-[#2F2763] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-[#1E1A3D] text-slate-600 dark:text-slate-300'
          }`}
        >
          Prescription Verification & Dispensing Queue
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-[#1E1A3D] text-slate-600 dark:text-slate-300'
          }`}
        >
          FEFO Batch Inventory & Expiry Control
        </button>
      </div>

      {/* TAB 1: DISPENSING QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Incoming Electronic Prescriptions
          </h4>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {ord.patientName}
                      </h4>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md">
                        {ord.prescriptionId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Prescribed by {ord.doctorName} • {ord.date}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider ${
                      ord.status === 'dispensed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        : ord.status === 'ready'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                        : ord.status === 'clarification'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                {/* Medications in Order */}
                <div className="p-3 bg-purple-50/40 dark:bg-[#16122E] rounded-2xl border border-purple-100 dark:border-[#2F2763] space-y-1.5">
                  {ord.medicines.map((med, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <span>💊 {med.name}</span>
                      <span className="text-purple-700 dark:text-purple-300">
                        Qty: {med.quantity} • Refills Left: {med.refillsLeft}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pharmacist Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-100 dark:border-[#2F2763]">
                  {ord.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Prepare</span>
                    </button>
                  )}

                  {ord.status === 'ready' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateOrderStatus(ord.id, 'dispensed')}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Dispense to Patient</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(ord.id, 'clarification')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#251E4E] text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Clarify with Doctor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateOrderStatus(ord.id, 'rejected')}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FEFO BATCH INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              FEFO (First-Expiry-First-Out) Inventory Stock
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              Cold Chain & Controlled Sub-Storage Monitored
            </span>
          </div>

          <div className="space-y-3">
            {inventory.map((item) => {
              const isNearExpiry = item.expiryDays <= 60;
              const isLowStock = item.stock <= item.reorderLevel;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white dark:bg-[#1E1A3D] rounded-3xl border border-purple-200/80 dark:border-[#382F6A] shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          {item.strength}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Batch: <strong>{item.batchNumber}</strong> • Supplier: {item.supplier}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Storage: {item.storage}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-base font-black block ${isNearExpiry ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {item.expiryDays} Days Left
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Exp: {item.expiryDate}
                      </span>
                    </div>
                  </div>

                  {/* Stock Quantity Controls */}
                  <div className="p-3 bg-purple-50/40 dark:bg-[#16122E] rounded-2xl border border-purple-100 dark:border-[#2F2763] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">In Stock:</span>
                      <span className={`text-sm font-black ${isLowStock ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                        {item.stock} Units
                      </span>
                      {isLowStock && (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-black">
                          Below Min ({item.reorderLevel})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.id, -10)}
                        className="px-2.5 py-1 bg-white dark:bg-[#251E4E] border border-slate-200 dark:border-[#352F63] rounded-lg text-xs font-black hover:bg-slate-50 cursor-pointer"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(item.id, 50)}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-black hover:bg-amber-700 cursor-pointer shadow-xs"
                      >
                        +50 Restock
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
