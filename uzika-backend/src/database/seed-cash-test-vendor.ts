import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const vendorRepo = app.get<Repository<Vendor>>(getRepositoryToken(Vendor));

  const vendor = vendorRepo.create({
    name: 'Cash Test Vendor',
    phone: '+255 700 111 222',
    location: 'Test Location',
    rating: 4.0,
    status: 'active',
    kycStatus: 'verified',
    isOpen: true,
    commission: 8,
  });
  await vendorRepo.save(vendor);

  console.log(`Created vendor id ${vendor.id}: ${vendor.name}`);
  await app.close();
}

seed();