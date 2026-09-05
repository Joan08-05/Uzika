import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type VendorStatus = 'active' | 'application' | 'suspended' | 'rejected';
export type KycStatus = 'verified' | 'pending';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  location: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: 0 })
  orders: number;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ type: 'float', default: 8 })
  commission: number;

  @Column({ default: 'application' })
  status: VendorStatus;

  @Column({ default: false })
  settledToday: boolean;

  @Column({ default: 'pending' })
  kycStatus: KycStatus;

  @Column({ default: true })
  isOpen: boolean;

  @Column({ type: 'varchar', nullable: true })
  suspendedReason: string | null;

  @Column({ type: 'timestamp', nullable: true })
  suspendedDate: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}