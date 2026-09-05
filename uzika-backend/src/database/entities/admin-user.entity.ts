import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AdminUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ default: 'Admin' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({ default: 'active' })
  status: 'pending' | 'active';

  @Column({ type: 'varchar', nullable: true })
  activationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  activationTokenExpiry: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  permissions: Record<string, boolean>;
}