import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

async function clearOrders() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo = app.get<Repository<Order>>(getRepositoryToken(Order));

  const count = await repo.count();
  console.log(`Found ${count} order(s). Deleting all...`);
  await repo.clear();

  const remaining = await repo.count();
  console.log(`Done. ${remaining} order(s) remain.`);

  await app.close();
}

clearOrders();