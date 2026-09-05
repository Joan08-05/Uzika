import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo = app.get<Repository<Vendor>>(getRepositoryToken(Vendor));

  const count = await repo.count();
  if (count > 0) {
    console.log(`Vendors table already has ${count} row(s). Skipping seed.`);
    await app.close();
    return;
  }

  const vendors = [
    { name: 'Mtaa Chips', phone: '+255 713 100 200', location: 'Sinza', rating: 4.3, orders: 28, balance: 120000, commission: 8, status: 'active', settledToday: true, kycStatus: 'verified' },
    { name: 'Chips Point', phone: '+255 714 200 300', location: 'Kinondoni', rating: 4.0, orders: 15, balance: 60000, commission: 8, status: 'active', settledToday: false, kycStatus: 'verified' },
    { name: 'Mama Asha Chips', phone: '+255 715 300 400', location: 'Kariakoo', rating: 4.6, orders: 40, balance: 200000, commission: 8, status: 'active', settledToday: true, kycStatus: 'verified' },
    { name: 'Chips Kona Mbezi', phone: '+255 713 222 111', location: 'Mbezi Beach', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false, kycStatus: 'pending' },
    { name: 'Dada Chips Tabata', phone: '+255 719 444 333', location: 'Tabata', rating: 0, orders: 0, balance: 0, commission: 8, status: 'application', settledToday: false, kycStatus: 'pending' },
    { name: 'Chips Express Buguruni', phone: '+255 713 888 000', location: 'Buguruni', rating: 3.1, orders: 18, balance: 42000, commission: 8, status: 'suspended', settledToday: false, kycStatus: 'verified', suspendedReason: 'Hygiene complaint', suspendedDate: new Date() },
  ] as const;

  for (const v of vendors) {
    const vendor = repo.create(v as any);
    await repo.save(vendor);
  }

  console.log(`Seeded ${vendors.length} vendors.`);
  await app.close();
}

seed();