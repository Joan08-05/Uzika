import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorStatus } from '../database/entities/vendor.entity';

@Injectable()
export class VendorsService {
  constructor(@InjectRepository(Vendor) private vendorRepo: Repository<Vendor>) {}

  async findAll(status?: VendorStatus) {
    if (status) {
      return this.vendorRepo.find({ where: { status }, order: { createdAt: 'DESC' } });
    }
    return this.vendorRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: number, status: VendorStatus, reason?: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    vendor.status = status;

    if (status === 'active') {
      vendor.kycStatus = 'verified';
    }

    if (status === 'suspended') {
      vendor.suspendedReason = reason ?? null;
      vendor.suspendedDate = new Date();
    } else {
      vendor.suspendedReason = null;
      vendor.suspendedDate = null;
    }

    await this.vendorRepo.save(vendor);
    return vendor;
  }

  async markSettled(id: number) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    vendor.settledToday = true;
    await this.vendorRepo.save(vendor);
    return vendor;
  }

  async toggleOpen(id: number) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    vendor.isOpen = !vendor.isOpen;
    await this.vendorRepo.save(vendor);
    return vendor;
  }
}