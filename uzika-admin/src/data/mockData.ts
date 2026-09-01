export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  vendor: string;
  customer: string;
  amount: number;
  status: OrderStatus;
}

export const orders: Order[] = [
  { id: 'CH10301', vendor: 'Mtaa Chips', customer: 'Deo', amount: 2500, status: 'Completed' },
  { id: 'CH10300', vendor: 'Bonge la Chips', customer: 'Hamisi', amount: 4500, status: 'Completed' },
  { id: 'CH10293', vendor: 'Chips Point', customer: 'Kelvin', amount: 7000, status: 'New' },
  { id: 'CH10292', vendor: 'Mtaa Chips', customer: 'Rehema', amount: 12500, status: 'Ready' },
  { id: 'CH10291', vendor: 'Mama Asha Chips', customer: 'John', amount: 8000, status: 'Preparing' },
];

export interface Vendor {
  name: string;
  location: string;
  rating: number;
  orders: number;
  balance: number;
  commission: number;
  status: 'active' | 'application' | 'suspended';
}

export const vendors: Vendor[] = [
  { name: 'Mama Asha Chips', location: 'Kariakoo', rating: 4.8, orders: 42, balance: 386000, commission: 8, status: 'active' },
  { name: 'Mtaa Chips', location: 'Sinza', rating: 4.5, orders: 37, balance: 512000, commission: 8, status: 'active' },
  { name: 'Chips Point', location: 'Sinza Kijiweni', rating: 4.2, orders: 29, balance: 240500, commission: 8, status: 'active' },
  { name: 'Bonge la Chips', location: 'Mwenge', rating: 4.7, orders: 51, balance: 623000, commission: 7, status: 'active' },
  { name: 'Kaka Juma Grill', location: 'Ubungo', rating: 4.8, orders: 24, balance: 198000, commission: 8, status: 'active' },
  { name: 'Chips Kona Mbezi', location: 'Mbezi Beach', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application' },
  { name: 'Dada Chips Tabata', location: 'Tabata', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application' },
  { name: 'Fresh Chips Kigamboni', location: 'Kigamboni', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application' },
  { name: 'Chips Express Buguruni', location: 'Buguruni', rating: 3.1, orders: 18, balance: 42000, commission: 8, status: 'suspended' },
];

export interface Customer {
  name: string;
  phone: string;
  orders: number;
  spend: number;
  points: number;
  status: 'active' | 'suspended';
}

export const customers: Customer[] = [
  { name: 'John Mushi', phone: '+255 754 111 222', orders: 43, spend: 391000, points: 3910, status: 'active' },
  { name: 'Rehema Said', phone: '+255 715 333 444', orders: 61, spend: 540200, points: 5402, status: 'active' },
  { name: 'Kelvin Joseph', phone: '+255 688 555 666', orders: 12, spend: 96400, points: 964, status: 'active' },
  { name: 'Baraka W.', phone: '+255 716 400 001', orders: 27, spend: 233800, points: 2338, status: 'active' },
  { name: 'A. Mwinyi', phone: '+255 692 777 888', orders: 4, spend: 402000, points: 4020, status: 'suspended' },
];

