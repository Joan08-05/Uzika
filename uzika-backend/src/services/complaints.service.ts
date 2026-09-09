import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from '../database/entities/complaint.entity';
import { Vendor } from '../database/entities/vendor.entity';
import { Customer } from '../database/entities/customer.entity';
import { AdminUser } from '../database/entities/admin-user.entity';
import { CreateComplaintDto } from '../dto/complaints/create-complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint) private complaintRepo: Repository<Complaint>,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
    @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
  ) {}

  private async resolveName(type: 'vendor' | 'customer', id: number): Promise<string> {
    if (type === 'vendor') {
      const vendor = await this.vendorRepo.findOne({ where: { id } });
      return vendor?.name ?? 'Unknown vendor';
    }
    const customer = await this.customerRepo.findOne({ where: { id } });
    return customer?.name ?? 'Unknown customer';
  }

  private async toResponseShape(complaint: Complaint) {
    const fromName = await this.resolveName(complaint.fromType, complaint.fromId);

    let aboutName: string | null = null;
    if (complaint.aboutType && complaint.aboutType !== 'general' && complaint.aboutId) {
      aboutName = await this.resolveName(complaint.aboutType, complaint.aboutId);
    }

    return {
      id: complaint.id,
      fromType: complaint.fromType,
      fromId: complaint.fromId,
      from: fromName,
      aboutType: complaint.aboutType,
      aboutId: complaint.aboutId,
      about: complaint.aboutType === 'general' ? 'General' : aboutName,
      issue: complaint.issue,
      status: complaint.status,
      resolvedByAdminName: complaint.resolvedByAdminName,
      resolvedAt: complaint.resolvedAt,
      ignoredByAdminName: complaint.ignoredByAdminName,
      ignoredAt: complaint.ignoredAt,
      createdAt: complaint.createdAt,
    };
  }

  async create(dto: CreateComplaintDto) {
    if (dto.fromType === 'vendor') {
      const vendor = await this.vendorRepo.findOne({ where: { id: dto.fromId } });
      if (!vendor) throw new BadRequestException('Vendor not found');
    } else {
      const customer = await this.customerRepo.findOne({ where: { id: dto.fromId } });
      if (!customer) throw new BadRequestException('Customer not found');
    }

    if (dto.aboutType && dto.aboutType !== 'general') {
      if (!dto.aboutId) {
        throw new BadRequestException('aboutId is required when aboutType is vendor or customer');
      }
      if (dto.aboutType === 'vendor') {
        const vendor = await this.vendorRepo.findOne({ where: { id: dto.aboutId } });
        if (!vendor) throw new BadRequestException('Vendor referenced in aboutId not found');
      } else {
        const customer = await this.customerRepo.findOne({ where: { id: dto.aboutId } });
        if (!customer) throw new BadRequestException('Customer referenced in aboutId not found');
      }
    }

    const complaint = this.complaintRepo.create({
      fromType: dto.fromType,
      fromId: dto.fromId,
      aboutType: dto.aboutType ?? null,
      aboutId: dto.aboutType && dto.aboutType !== 'general' ? dto.aboutId ?? null : null,
      issue: dto.issue,
      status: 'open',
    });
    await this.complaintRepo.save(complaint);

    return this.toResponseShape(complaint);
  }

  async findAll() {
    const complaints = await this.complaintRepo.find({ order: { createdAt: 'DESC' } });
    return Promise.all(complaints.map((c) => this.toResponseShape(c)));
  }

  async resolve(id: number, admin: { userId: number }) {
    const complaint = await this.complaintRepo.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Complaint not found');

    if (complaint.status !== 'open') {
      throw new BadRequestException(`This complaint is already ${complaint.status}`);
    }

    const adminUser = await this.adminRepo.findOne({ where: { id: admin.userId } });

    complaint.status = 'resolved';
    complaint.resolvedByAdminId = admin.userId;
    complaint.resolvedByAdminName = adminUser?.name ?? 'Unknown admin';
    complaint.resolvedAt = new Date();

    await this.complaintRepo.save(complaint);
    return this.toResponseShape(complaint);
  }

  async ignore(id: number, admin: { userId: number }) {
    const complaint = await this.complaintRepo.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Complaint not found');

    if (complaint.status !== 'open') {
      throw new BadRequestException(`This complaint is already ${complaint.status}`);
    }

    const adminUser = await this.adminRepo.findOne({ where: { id: admin.userId } });

    complaint.status = 'ignored';
    complaint.ignoredByAdminId = admin.userId;
    complaint.ignoredByAdminName = adminUser?.name ?? 'Unknown admin';
    complaint.ignoredAt = new Date();

    await this.complaintRepo.save(complaint);
    return this.toResponseShape(complaint);
  }

  async reconsider(id: number) {
    const complaint = await this.complaintRepo.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Complaint not found');

    if (complaint.status !== 'ignored') {
        throw new BadRequestException('Only ignored complaints can be reconsidered');
    }

    complaint.status = 'open';
    complaint.ignoredByAdminId = null;
    complaint.ignoredByAdminName = null;
    complaint.ignoredAt = null;

    await this.complaintRepo.save(complaint);
    return this.toResponseShape(complaint);
    }
}