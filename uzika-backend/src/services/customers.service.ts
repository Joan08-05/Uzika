import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerStatus } from '../database/entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customer) private customerRepo: Repository<Customer>) {}

  async findAll() {
    return this.customerRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: number, status: CustomerStatus) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.status = status;
    await this.customerRepo.save(customer);
    return customer;
  }

  async markRefunded(id: number) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.refunded = true;
    await this.customerRepo.save(customer);
    return customer;
  }
}