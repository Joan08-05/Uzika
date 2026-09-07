import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../database/entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepo: Repository<Order>) {}

  private toResponseShape(order: Order) {
    return {
      id: order.id,
      vendor: order.vendor?.name ?? 'Unknown',
      vendorId: order.vendorId,
      customer: order.customer?.name ?? 'Unknown',
      customerId: order.customerId,
      location: order.location,
      amount: order.amount,
      status: order.status,
      items: order.items,
      payment: order.payment,
      timeline: order.timeline,
      refundIssued: order.refundIssued,
    };
  }

  async findAll() {
    const orders = await this.orderRepo.find({ order: { createdAt: 'DESC' } });
    return orders.map(o => this.toResponseShape(o));
  }

  async issueRefund(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    order.refundIssued = true;
    await this.orderRepo.save(order);
    return this.toResponseShape(order);
  }
}