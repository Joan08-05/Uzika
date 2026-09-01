export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface TimelineStep {
  stage: 'Received' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed';
  time: string | null;
}

export interface Order {
  id: string;
  vendor: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  items: string;
  payment: string;
  timeline: TimelineStep[];
}

export const orders: Order[] = [
  {
    id: 'CH10301', vendor: 'Mtaa Chips', customer: 'Deo', amount: 2500, status: 'Completed',
    items: 'Chips, Soda', payment: 'M-Pesa',
    timeline: [
      { stage: 'Received', time: '12:40' }, { stage: 'Accepted', time: '12:41' },
      { stage: 'Preparing', time: '12:44' }, { stage: 'Ready', time: '12:52' },
      { stage: 'Completed', time: '12:58' },
    ],
  },
  {
    id: 'CH10293', vendor: 'Chips Point', customer: 'Kelvin', amount: 7000, status: 'New',
    items: 'Chips Mayai, Soda', payment: 'M-Pesa',
    timeline: [
      { stage: 'Received', time: '14:48' }, { stage: 'Accepted', time: null },
      { stage: 'Preparing', time: null }, { stage: 'Ready', time: null },
      { stage: 'Completed', time: null },
    ],
  },
  {
    id: 'CH10292', vendor: 'Mtaa Chips', customer: 'Rehema', amount: 12500, status: 'Ready',
    items: 'Chips Kuku, Soda x2', payment: 'Airtel Money',
    timeline: [
      { stage: 'Received', time: '13:10' }, { stage: 'Accepted', time: '13:12' },
      { stage: 'Preparing', time: '13:15' }, { stage: 'Ready', time: '13:30' },
      { stage: 'Completed', time: null },
    ],
  },
  {
    id: 'CH10291', vendor: 'Mama Asha Chips', customer: 'John', amount: 8000, status: 'Preparing',
    items: 'Chips, Mishkaki', payment: 'Cash',
    timeline: [
      { stage: 'Received', time: '14:20' }, { stage: 'Accepted', time: '14:22' },
      { stage: 'Preparing', time: '14:25' }, { stage: 'Ready', time: null },
      { stage: 'Completed', time: null },
    ],
  },
  {
    id: 'CH10300', vendor: 'Bonge la Chips', customer: 'Hamisi', amount: 4500, status: 'Completed',
    items: 'Chips, Sausage', payment: 'Halopesa',
    timeline: [
      { stage: 'Received', time: '11:00' }, { stage: 'Accepted', time: '11:02' },
      { stage: 'Preparing', time: '11:05' }, { stage: 'Ready', time: '11:15' },
      { stage: 'Completed', time: '11:20' },
    ],
  },
];

export interface Vendor {
  name: string;
  location: string;
  rating: number;
  orders: number;
  balance: number;
  commission: number;
  status: 'active' | 'application' | 'suspended' | 'rejected';
  settledToday: boolean;
}

export const vendors: Vendor[] = [
  { name: 'Mama Asha Chips', location: 'Kariakoo', rating: 4.8, orders: 42, balance: 386000, commission: 8, status: 'active', settledToday: false },
  { name: 'Mtaa Chips', location: 'Sinza', rating: 4.5, orders: 37, balance: 512000, commission: 8, status: 'active', settledToday: false },
  { name: 'Chips Point', location: 'Sinza Kijiweni', rating: 4.2, orders: 29, balance: 240500, commission: 8, status: 'active', settledToday: false },
  { name: 'Bonge la Chips', location: 'Mwenge', rating: 4.7, orders: 51, balance: 623000, commission: 7, status: 'active', settledToday: false },
  { name: 'Kaka Juma Grill', location: 'Ubungo', rating: 4.8, orders: 24, balance: 198000, commission: 8, status: 'active', settledToday: false },
  { name: 'Chips Kona Mbezi', location: 'Mbezi Beach', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false },
  { name: 'Dada Chips Tabata', location: 'Tabata', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false },
  { name: 'Fresh Chips Kigamboni', location: 'Kigamboni', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false },
  { name: 'Chips Express Buguruni', location: 'Buguruni', rating: 3.1, orders: 18, balance: 42000, commission: 8, status: 'suspended', settledToday: false },
];

export interface Customer {
  name: string;
  phone: string;
  orders: number;
  spend: number;
  points: number;
  status: 'active' | 'suspended';
  refunded: boolean;
}

export const customers: Customer[] = [
  { name: 'John Mushi', phone: '+255 754 111 222', orders: 43, spend: 391000, points: 3910, status: 'active', refunded: false },
  { name: 'Rehema Said', phone: '+255 715 333 444', orders: 61, spend: 540200, points: 5402, status: 'active', refunded: false },
  { name: 'Kelvin Joseph', phone: '+255 688 555 666', orders: 12, spend: 96400, points: 964, status: 'active', refunded: false },
  { name: 'Baraka W.', phone: '+255 716 400 001', orders: 27, spend: 233800, points: 2338, status: 'active', refunded: false },
  { name: 'A. Mwinyi', phone: '+255 692 777 888', orders: 4, spend: 402000, points: 4020, status: 'suspended', refunded: false },
];
export interface Complaint {
  from: string;
  fromType: 'vendor' | 'customer';
  issue: string;
}

export const complaints: Complaint[] = [
  { from: 'Chips Express Buguruni', fromType: 'vendor', issue: 'Hygiene complaint from customer' },
  { from: 'A. Mwinyi', fromType: 'customer', issue: 'Order arrived incomplete' },
  { from: 'Mtaa Chips', fromType: 'vendor', issue: 'Late delivery reported' },
  { from: 'Baraka W.', fromType: 'customer', issue: 'Wrong item received' },
];
