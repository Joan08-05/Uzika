import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, TimelineStep } from '../database/entities/order.entity';
import { Vendor } from '../database/entities/vendor.entity';
import { CreateOrderDto } from '../dto/orders/create-order.dto';

const CASH_PAYMENT_METHODS = ['Cash'];

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
  ) {}

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

  private async findOrderOrThrow(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  private stampStage(timeline: TimelineStep[], stage: TimelineStep['stage']): TimelineStep[] {
    return timeline.map((t) =>
      t.stage === stage ? { ...t, time: new Date().toLocaleTimeString() } : t,
    );
  }

  async findAll() {
    const orders = await this.orderRepo.find({ order: { createdAt: 'DESC' } });
    return orders.map((o) => this.toResponseShape(o));
  }

  // Creates a brand-new order and immediately charges commission on it,
  // regardless of cash or mobile money. The exact commission amount is
  // stored on the order itself, so a later cancellation reverses precisely
  // what was charged — even if the vendor's rate changes in between.
  async createOrder(dto: CreateOrderDto) {
    const vendor = await this.vendorRepo.findOne({ where: { id: dto.vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const startingTimeline: TimelineStep[] = [
      { stage: 'Received', time: null },
      { stage: 'Accepted', time: null },
      { stage: 'Preparing', time: null },
      { stage: 'Ready', time: null },
      { stage: 'Completed', time: null },
    ];

    const commissionForOrder = Number(dto.amount) * (vendor.commission / 100);

    const order = this.orderRepo.create({
      id: `ORD${Date.now()}`,
      vendorId: dto.vendorId,
      customerId: dto.customerId,
      location: dto.location,
      amount: dto.amount,
      items: dto.items,
      payment: dto.payment,
      status: 'New',
      timeline: this.stampStage(startingTimeline, 'Received'),
      refundIssued: false,
      commissionCharged: true,
      commissionAmount: commissionForOrder,
    });

    vendor.commissionOwed += commissionForOrder;
    if (!CASH_PAYMENT_METHODS.includes(dto.payment)) {
      vendor.mobileMoneyPendingSettlement += Number(dto.amount);
    }

    await this.vendorRepo.save(vendor);
    await this.orderRepo.save(order);

    return this.toResponseShape(order);
  }

  // Cancels an order, only while it's still "New". Reverses the EXACT
  // commission amount stored on the order at creation time, not a
  // recalculation against the vendor's current rate.
  async cancelOrder(id: string) {
    const order = await this.findOrderOrThrow(id);

    if (order.status !== 'New') {
      throw new BadRequestException(
        `Cannot cancel an order with status "${order.status}". Orders can only be cancelled before preparation starts.`,
      );
    }

    const vendor = await this.vendorRepo.findOne({ where: { id: order.vendorId } });
    if (vendor) {
      vendor.commissionOwed -= order.commissionAmount;
      if (!CASH_PAYMENT_METHODS.includes(order.payment)) {
        vendor.mobileMoneyPendingSettlement -= Number(order.amount);
      }
      await this.vendorRepo.save(vendor);
    }

    order.status = 'Cancelled';
    await this.orderRepo.save(order);

    return this.toResponseShape(order);
  }

  async issueRefund(id: string) {
    const order = await this.findOrderOrThrow(id);
    order.refundIssued = true;
    await this.orderRepo.save(order);
    return this.toResponseShape(order);
  }

  async acceptOrder(id: string) {
  const order = await this.findOrderOrThrow(id);
  if (order.status !== 'New') {
    throw new BadRequestException(`Cannot accept an order with status "${order.status}"`);
  }
  order.status = 'Preparing';
  order.timeline = this.stampStage(order.timeline, 'Accepted');
  order.timeline = this.stampStage(order.timeline, 'Preparing');
  await this.orderRepo.save(order);
  return this.toResponseShape(order);
}

  async markReady(id: string) {
    const order = await this.findOrderOrThrow(id);
    if (order.status !== 'Preparing') {
      throw new BadRequestException(`Cannot mark ready an order with status "${order.status}"`);
    }
    order.status = 'Ready';
    order.timeline = this.stampStage(order.timeline, 'Ready');
    await this.orderRepo.save(order);
    return this.toResponseShape(order);
  }

  async confirmHandover(id: string) {
    const order = await this.findOrderOrThrow(id);
    if (order.status !== 'Ready') {
      throw new BadRequestException(`Cannot complete an order with status "${order.status}"`);
    }
    order.status = 'Completed';
    order.timeline = this.stampStage(order.timeline, 'Completed');
    await this.orderRepo.save(order);
    return this.toResponseShape(order);
  }
}