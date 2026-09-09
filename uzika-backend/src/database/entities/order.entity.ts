import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';
import { Customer } from './customer.entity';

export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface TimelineStep {
  stage: 'Received' | 'Accepted' | 'Preparing' | 'Ready' | 'Completed';
  time: string | null;
}

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Vendor, { eager: true })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @Column()
  vendorId: number;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: number;

  @Column()
  location: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ default: 'New' })
  status: OrderStatus;

  @Column()
  items: string;

  @Column()
  payment: string;

  @Column({ type: 'jsonb' })
  timeline: TimelineStep[];

  @Column({ default: false })
  refundIssued: boolean;

  @Column({ default: false })
  commissionCharged: boolean;

  @Column({ type: 'float', default: 0 })
  commissionAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}