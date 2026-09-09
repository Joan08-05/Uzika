import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type ComplaintFromType = 'vendor' | 'customer';
export type ComplaintAboutType = 'vendor' | 'customer' | 'general';
export type ComplaintStatus = 'open' | 'resolved' | 'ignored';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['vendor', 'customer'] })
  fromType: ComplaintFromType;

  @Column()
  fromId: number;

  @Column({ type: 'enum', enum: ['vendor', 'customer', 'general'], nullable: true })
  aboutType: ComplaintAboutType | null;

  @Column({ type: 'int', nullable: true })
  aboutId: number | null;

  @Column()
  issue: string;

  @Column({ default: 'open' })
  status: ComplaintStatus;

  @Column({ type: 'int', nullable: true })
  resolvedByAdminId: number | null;

  @Column({ type: 'varchar', nullable: true })
  resolvedByAdminName: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  ignoredByAdminId: number | null;

  @Column({ type: 'varchar', nullable: true })
  ignoredByAdminName: string | null;

  @Column({ type: 'timestamp', nullable: true })
  ignoredAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}