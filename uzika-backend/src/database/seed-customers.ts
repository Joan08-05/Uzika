import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo = app.get<Repository<Customer>>(getRepositoryToken(Customer));

  const count = await repo.count();
  if (count > 0) {
    console.log(`Customers table already has ${count} row(s). Skipping seed.`);
    await app.close();
    return;
  }

  const customers = [
    { name: 'John Mushi', phone: '+255 712 300 400', orders: 12, spend: 84000, points: 840, status: 'active', refunded: false, isMember: true },
    { name: 'Rehema Said', phone: '+255 713 400 500', orders: 5, spend: 32000, points: 320, status: 'active', refunded: false, isMember: false },
    { name: 'Kelvin Joseph', phone: '+255 714 500 600', orders: 20, spend: 150000, points: 1500, status: 'active', refunded: false, isMember: true },
    { name: 'Baraka W.', phone: '+255 715 600 700', orders: 3, spend: 21000, points: 210, status: 'suspended', refunded: false, isMember: false },
    { name: 'Amina Mwinyi', phone: '+255 716 700 800', orders: 8, spend: 56000, points: 560, status: 'active', refunded: true, isMember: true },
  ] as const;

  for (const c of customers) {
    const customer = repo.create(c as any);
    await repo.save(customer);
  }

  console.log(`Seeded ${customers.length} customers.`);
  await app.close();
}

seed();