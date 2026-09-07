import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type CustomerStatus = 'active' | 'suspended';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: 0 })
  orders: number;

  @Column({ type: 'float', default: 0 })
  spend: number;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 'active' })
  status: CustomerStatus;

  @Column({ default: false })
  refunded: boolean;

  @Column({ default: false })
  isMember: boolean;

  @CreateDateColumn()
  createdAt: Date;
}