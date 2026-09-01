import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: true })
  isOpen: boolean;
}