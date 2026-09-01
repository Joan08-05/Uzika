import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import {
  orders as initialOrders,
  vendors as initialVendors,
  customers as initialCustomers,
  complaints as initialComplaints,
} from '../data/mockData';
import type { Order, Vendor, Customer, Complaint } from '../data/mockData';

interface DataContextType {
  orders: Order[];
  vendors: Vendor[];
  customers: Customer[];
  complaints: Complaint[];
  updateVendorStatus: (name: string, status: Vendor['status']) => void;
  markVendorSettled: (name: string) => void;
  toggleCustomerSuspend: (name: string) => void;
  markCustomerRefunded: (name: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders] = useState<Order[]>(initialOrders);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [complaints] = useState<Complaint[]>(initialComplaints);

  function updateVendorStatus(name: string, status: Vendor['status']) {
    setVendors(prev => prev.map(v => (v.name === name ? { ...v, status } : v)));
  }

  function markVendorSettled(name: string) {
    setVendors(prev => prev.map(v => (v.name === name ? { ...v, settledToday: true } : v)));
  }

  function toggleCustomerSuspend(name: string) {
    setCustomers(prev =>
      prev.map(c => (c.name === name ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c))
    );
  }

  function markCustomerRefunded(name: string) {
    setCustomers(prev => prev.map(c => (c.name === name ? { ...c, refunded: true } : c)));
  }

  return (
    <DataContext.Provider
      value={{ orders, vendors, customers, complaints, updateVendorStatus, markVendorSettled, toggleCustomerSuspend, markCustomerRefunded }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}