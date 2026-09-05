import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';

async function clearAdmins() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const repo = app.get<Repository<AdminUser>>(getRepositoryToken(AdminUser));

  const count = await repo.count();
  console.log(`Found ${count} admin user(s). Deleting all...`);

  await repo.clear();

  const remaining = await repo.count();
  console.log(`Done. ${remaining} admin user(s) remain.`);

  await app.close();
}

clearAdmins();