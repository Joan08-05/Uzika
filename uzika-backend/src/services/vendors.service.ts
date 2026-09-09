import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vendor, VendorStatus } from '../database/entities/vendor.entity';
import { Order } from '../database/entities/order.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { SettlementRecord } from '../database/entities/settlement-record.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
    @InjectRepository(SettlementRecord) private settlementRepo: Repository<SettlementRecord>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  // No longer charges commission here — that happens the moment an order is
  // created, in OrdersService. This just reads current data to display it;
  // it never mutates the ledger.
  private async attachComputedStats(vendors: Vendor[]) {
    const orders = await this.orderRepo.find();

    return vendors.map((v) => {
      const vendorOrders = orders.filter((o) => o.vendorId === v.id && o.status !== 'Cancelled');
      const balance = vendorOrders.reduce((sum, o) => sum + Number(o.amount), 0);

      return {
        ...v,
        orders: vendorOrders.length,
        balance,
      };
    });
  }

  async findAll(status?: VendorStatus) {
    const vendors = status
      ? await this.vendorRepo.find({ where: { status }, order: { createdAt: 'ASC' } })
      : await this.vendorRepo.find({ order: { createdAt: 'ASC' } });
    return this.attachComputedStats(vendors);
  }

  async updateStatus(id: number, status: VendorStatus, reason?: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    vendor.status = status;
    if (status === 'active') vendor.kycStatus = 'verified';

    if (status === 'suspended') {
      vendor.suspendedReason = reason ?? null;
      vendor.suspendedDate = new Date();
    } else {
      vendor.suspendedReason = null;
      vendor.suspendedDate = null;
    }

    await this.vendorRepo.save(vendor);
    const [withStats] = await this.attachComputedStats([vendor]);
    return withStats;
  }

  // Settles a vendor: pays out mobileMoneyPendingSettlement minus commissionOwed.
  // If commission exceeds what's collected, pays 0 and carries the remaining
  // debt forward. Row-locked for the transaction so two rapid "Approve" clicks
  // can't both process the same settlement. Logs a SettlementRecord every time,
  // so the ledger has a permanent audit trail instead of just current totals.
  async markSettled(id: number, admin: { userId: number }) {
    return this.dataSource.transaction(async (manager) => {
      const vendor = await manager.findOne(Vendor, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!vendor) throw new NotFoundException('Vendor not found');

      const adminUser = await manager.findOne(AdminUser, { where: { id: admin.userId } });

      const mobileMoneyCollected = vendor.mobileMoneyPendingSettlement;
      const commissionCharged = vendor.commissionOwed;
      const settlementAmount = mobileMoneyCollected - commissionCharged;

      let payout = 0;
      let remainingDebtCarried = 0;

      if (settlementAmount >= 0) {
        payout = settlementAmount;
        vendor.commissionOwed = 0;
        vendor.mobileMoneyPendingSettlement = 0;
      } else {
        payout = 0;
        remainingDebtCarried = commissionCharged - mobileMoneyCollected;
        vendor.commissionOwed = remainingDebtCarried;
        vendor.mobileMoneyPendingSettlement = 0;
      }

      vendor.settledToday = true;
      await manager.save(vendor);

      const record = manager.create(SettlementRecord, {
        vendorId: vendor.id,
        mobileMoneyCollected,
        commissionCharged,
        payoutAmount: payout,
        remainingDebtCarried,
        settledByAdminId: adminUser?.id ?? admin.userId,
        settledByAdminName: adminUser?.name ?? 'Unknown admin',
      });
      await manager.save(record);

      const [withStats] = await this.attachComputedStats([vendor]);
      return { ...withStats, payout };
    });
  }

  async getSettlementHistory(vendorId: number) {
    return this.settlementRepo.find({
      where: { vendorId },
      order: { settledAt: 'DESC' },
    });
  }

  async toggleOpen(id: number) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    vendor.isOpen = !vendor.isOpen;
    await this.vendorRepo.save(vendor);
    const [withStats] = await this.attachComputedStats([vendor]);
    return withStats;
  }
}