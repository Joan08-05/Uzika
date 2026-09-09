import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SettlementRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendorId: number;

  @Column({ type: 'float' })
  mobileMoneyCollected: number;

  @Column({ type: 'float' })
  commissionCharged: number;

  @Column({ type: 'float' })
  payoutAmount: number;

  @Column({ type: 'float' })
  remainingDebtCarried: number;

  @Column()
  settledByAdminId: number;

  @Column()
  settledByAdminName: string;

  @CreateDateColumn()
  settledAt: Date;
}