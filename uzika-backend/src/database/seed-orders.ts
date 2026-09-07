import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Vendor } from './entities/vendor.entity';
import { Customer } from './entities/customer.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const orderRepo = app.get<Repository<Order>>(getRepositoryToken(Order));
  const vendorRepo = app.get<Repository<Vendor>>(getRepositoryToken(Vendor));
  const customerRepo = app.get<Repository<Customer>>(getRepositoryToken(Customer));

  const count = await orderRepo.count();
  if (count > 0) {
    console.log(`Orders table already has ${count} row(s). Skipping seed.`);
    await app.close();
    return;
  }

  const mtaaChips = await vendorRepo.findOne({ where: { name: 'Mtaa Chips' } });
  const chipsPoint = await vendorRepo.findOne({ where: { name: 'Chips Point' } });
  const mamaAsha = await vendorRepo.findOne({ where: { name: 'Mama Asha Chips' } });

  const deo = await customerRepo.findOne({ where: { name: 'John Mushi' } });
  const kelvin = await customerRepo.findOne({ where: { name: 'Kelvin Joseph' } });
  const rehema = await customerRepo.findOne({ where: { name: 'Rehema Said' } });

  if (!mtaaChips || !chipsPoint || !mamaAsha || !deo || !kelvin || !rehema) {
    console.log('Missing required vendors/customers. Seed vendors and customers first.');
    await app.close();
    return;
  }

  const orders = [
    {
      id: 'CH10301', vendorId: mtaaChips.id, customerId: deo.id, location: 'Sinza Kwa Remmy',
      amount: 2500, status: 'Completed', items: 'Chips, Soda', payment: 'M-Pesa',
      timeline: [
        { stage: 'Received', time: '12:40' }, { stage: 'Accepted', time: '12:41' },
        { stage: 'Preparing', time: '12:44' }, { stage: 'Ready', time: '12:52' },
        { stage: 'Completed', time: '12:58' },
      ],
      refundIssued: false,
    },
    {
      id: 'CH10293', vendorId: chipsPoint.id, customerId: kelvin.id, location: 'Kinondoni Mkwajuni',
      amount: 7000, status: 'New', items: 'Chips Mayai, Soda', payment: 'M-Pesa',
      timeline: [
        { stage: 'Received', time: '14:48' }, { stage: 'Accepted', time: null },
        { stage: 'Preparing', time: null }, { stage: 'Ready', time: null },
        { stage: 'Completed', time: null },
      ],
      refundIssued: false,
    },
    {
      id: 'CH10292', vendorId: mtaaChips.id, customerId: rehema.id, location: 'Mikocheni B',
      amount: 12500, status: 'Ready', items: 'Chips Kuku, Soda x2', payment: 'Airtel Money',
      timeline: [
        { stage: 'Received', time: '13:10' }, { stage: 'Accepted', time: '13:12' },
        { stage: 'Preparing', time: '13:15' }, { stage: 'Ready', time: '13:30' },
        { stage: 'Completed', time: null },
      ],
      refundIssued: false,
    },
    {
      id: 'CH10291', vendorId: mamaAsha.id, customerId: deo.id, location: 'Kariakoo Mchikichini',
      amount: 8000, status: 'Preparing', items: 'Chips, Mishkaki', payment: 'Cash',
      timeline: [
        { stage: 'Received', time: '14:20' }, { stage: 'Accepted', time: '14:22' },
        { stage: 'Preparing', time: '14:25' }, { stage: 'Ready', time: null },
        { stage: 'Completed', time: null },
      ],
      refundIssued: false,
    },
  ] as const;

  for (const o of orders) {
    const order = orderRepo.create(o as any);
    await orderRepo.save(order);
  }

  console.log(`Seeded ${orders.length} orders, correctly linked to real vendors and customers.`);
  await app.close();
}

seed();