export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface TimelineStep {
  stage: 'Received' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed';
  time: string | null;
}

export interface Order {
  id: string;
  vendor: string;
  customer: string;
  location: string;
  amount: number;
  status: OrderStatus;
  items: string;
  payment: string;
  timeline: TimelineStep[];
  refundIssued: boolean;
}

export const orders: Order[] = [
  {
    id: 'CH10301', vendor: 'Mtaa Chips', customer: 'Deo', location: 'Sinza Kwa Remmy',
    amount: 2500, status: 'Completed', items: 'Chips, Soda', payment: 'M-Pesa',
    timeline: [
      { stage: 'Received', time: '12:40' }, { stage: 'Accepted', time: '12:41' },
      { stage: 'Preparing', time: '12:44' }, { stage: 'Ready', time: '12:52' },
      { stage: 'Completed', time: '12:58' },
    ],
    refundIssued: false,
  },
  {
    id: 'CH10293', vendor: 'Chips Point', customer: 'Kelvin', location: 'Kinondoni Mkwajuni',
    amount: 7000, status: 'New', items: 'Chips Mayai, Soda', payment: 'M-Pesa',
    timeline: [
      { stage: 'Received', time: '14:48' }, { stage: 'Accepted', time: null },
      { stage: 'Preparing', time: null }, { stage: 'Ready', time: null },
      { stage: 'Completed', time: null },
    ],
    refundIssued: false,
  },
  {
    id: 'CH10292', vendor: 'Mtaa Chips', customer: 'Rehema', location: 'Mikocheni B',
    amount: 12500, status: 'Ready', items: 'Chips Kuku, Soda x2', payment: 'Airtel Money',
    timeline: [
      { stage: 'Received', time: '13:10' }, { stage: 'Accepted', time: '13:12' },
      { stage: 'Preparing', time: '13:15' }, { stage: 'Ready', time: '13:30' },
      { stage: 'Completed', time: null },
    ],
    refundIssued: false,
  },
  {
    id: 'CH10291', vendor: 'Mama Asha Chips', customer: 'John', location: 'Kariakoo Mchikichini',
    amount: 8000, status: 'Preparing', items: 'Chips, Mishkaki', payment: 'Cash',
    timeline: [
      { stage: 'Received', time: '14:20' }, { stage: 'Accepted', time: '14:22' },
      { stage: 'Preparing', time: '14:25' }, { stage: 'Ready', time: null },
      { stage: 'Completed', time: null },
    ],
    refundIssued: false,
  },
  {
    id: 'CH10300', vendor: 'Bonge la Chips', customer: 'Hamisi', location: 'Mwenge Kwa Msomi',
    amount: 4500, status: 'Completed', items: 'Chips, Sausage', payment: 'Halopesa',
    timeline: [
      { stage: 'Received', time: '11:00' }, { stage: 'Accepted', time: '11:02' },
      { stage: 'Preparing', time: '11:05' }, { stage: 'Ready', time: '11:15' },
      { stage: 'Completed', time: '11:20' },
    ],
    refundIssued: false,
  },
];

export interface Vendor {
  name: string;
  phone: string;
  location: string;
  rating: number;
  orders: number;
  balance: number;
  commission: number;
  status: 'active' | 'application' | 'suspended' | 'rejected';
  settledToday: boolean;
  kycStatus: 'verified' | 'pending';
  suspendedReason?: string;
  suspendedDate?: string;
}

const LOCATIONS = [
  'Kariakoo', 'Sinza', 'Mwenge', 'Ubungo', 'Kigamboni', 'Tabata', 'Mbezi Beach',
  'Manzese', 'Buguruni', 'Kinondoni', 'Magomeni', 'Tandale', 'Ilala', 'Kimara', 'Mikocheni',
];

const VENDOR_NAME_PARTS = [
  'Mama Asha', 'Mtaa', 'Chips Point', 'Bonge la', 'Kaka Juma', 'Dada Fatuma',
  'Chipsi ya', 'Mzee John', 'Rafiki', 'Baraka', 'Neema', 'Upendo', 'Jamaa',
  'Kona ya', 'Chipsi Poa',
];

function generateActiveVendors(count: number): Vendor[] {
  const list: Vendor[] = [];
  for (let i = 0; i < count; i++) {
    const namePart = VENDOR_NAME_PARTS[i % VENDOR_NAME_PARTS.length];
    const location = LOCATIONS[i % LOCATIONS.length];
    list.push({
      name: `${namePart} Chips ${location}`,
      phone: `+255 7${(10 + i).toString().padStart(2, '0')} ${(100 + i * 7).toString().padStart(3, '0')} ${(200 + i * 11).toString().padStart(3, '0')}`,
      location,
      rating: Math.round((3.5 + (i % 15) * 0.1) * 10) / 10,
      orders: 5 + (i * 3) % 55,
      balance: 20000 + (i * 17000) % 600000,
      commission: 8,
      status: 'active',
      settledToday: i % 4 === 0,
      kycStatus: 'verified',
    });
  }
  return list;
}

export const vendors: Vendor[] = [
  ...generateActiveVendors(28),
  { name: 'Chips Kona Mbezi', phone: '+255 713 222 111', location: 'Mbezi Beach', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false, kycStatus: 'pending' },
  { name: 'Dada Chips Tabata', phone: '+255 719 444 333', location: 'Tabata', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false, kycStatus: 'pending' },
  { name: 'Fresh Chips Kigamboni', phone: '+255 717 555 999', location: 'Kigamboni', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false, kycStatus: 'pending' },
  { name: 'Chips Express Buguruni', phone: '+255 713 888 000', location: 'Buguruni', rating: 3.1, orders: 18, balance: 42000, commission: 8, status: 'suspended', settledToday: false, kycStatus: 'verified', suspendedReason: 'Hygiene complaint', suspendedDate: 'leo' },
  { name: 'Kimoka Chips Point', phone: '+255 714 222 555', location: 'Manzese', rating: 2.8, orders: 9, balance: 15000, commission: 8, status: 'suspended', settledToday: false, kycStatus: 'verified', suspendedReason: 'Fraud flag', suspendedDate: 'juzi' },
];

export interface Customer {
  name: string;
  phone: string;
  orders: number;
  spend: number;
  points: number;
  status: 'active' | 'suspended';
  refunded: boolean;
  isMember: boolean;
}

const CUSTOMER_FIRST_NAMES = [
  'John', 'Rehema', 'Kelvin', 'Baraka', 'Amina', 'Juma', 'Fatuma', 'Hassan',
  'Grace', 'Elias', 'Zainab', 'Peter', 'Halima', 'Daudi', 'Mwajuma',
];
const CUSTOMER_LAST_NAMES = [
  'Mushi', 'Said', 'Joseph', 'W.', 'Mwinyi', 'Kileo', 'Rashid', 'Mbwana', 'Komba', 'Salum',
];

function generateCustomers(count: number): Customer[] {
  const list: Customer[] = [];
  for (let i = 0; i < count; i++) {
    const first = CUSTOMER_FIRST_NAMES[i % CUSTOMER_FIRST_NAMES.length];
    const last = CUSTOMER_LAST_NAMES[i % CUSTOMER_LAST_NAMES.length];
    const orderCount = 1 + (i * 3) % 62;
    const spend = orderCount * (5000 + (i % 7) * 1500);
    list.push({
      name: `${first} ${last}`,
      phone: `+255 7${(20 + i).toString().padStart(2, '0')} ${(300 + i * 5).toString().padStart(3, '0')} ${(400 + i * 9).toString().padStart(3, '0')}`,
      orders: orderCount,
      spend,
      points: Math.round(spend / 100),
      status: i % 9 === 0 ? 'suspended' : 'active',
      refunded: false,
      isMember: i % 3 !== 0,
    });
  }
  return list;
}

export const customers: Customer[] = generateCustomers(34);

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