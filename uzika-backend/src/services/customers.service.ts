import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerStatus } from '../database/entities/customer.entity';
import { Order } from '../database/entities/order.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  private async attachComputedStats(customers: Customer[]) {
    const orders = await this.orderRepo.find();

    return customers.map((c) => {
      const customerOrders = orders.filter((o) => o.customerId === c.id);
      const spend = customerOrders.reduce((sum, o) => sum + Number(o.amount), 0);
      return {
        ...c,
        orders: customerOrders.length,
        spend,
        points: Math.round(spend / 100),
      };
    });
  }

  async findAll() {
    const customers = await this.customerRepo.find({ order: { createdAt: 'ASC' } });
    return this.attachComputedStats(customers);
  }

  async updateStatus(id: number, status: CustomerStatus) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.status = status;
    await this.customerRepo.save(customer);
    const [withStats] = await this.attachComputedStats([customer]);
    return withStats;
  }

  async markRefunded(id: number) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    customer.refunded = true;
    await this.customerRepo.save(customer);
    const [withStats] = await this.attachComputedStats([customer]);
    return withStats;
  }
}