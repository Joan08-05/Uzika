import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as dns from 'dns';
import { AdminUser } from '../database/entities/admin-user.entity';
import { SignupDto } from '../dto/auth/signup.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { UpdateProfileDto } from '../dto/auth/update-profile.dto';
import { MailService } from './mail.service';
import { InviteAdminDto } from '../dto/auth/invite-admin.dto';

const DEFAULT_PERMISSIONS: Record<string, boolean> = {
  dashboard: true,
  orders: false,
  vendors: false,
  customers: false,
  reports: false,
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    const validDomain = await domainAcceptsMail(dto.email);
    if (!validDomain) {
      throw new BadRequestException('This email domain does not appear to be real.');
    }

    const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.adminRepo.create({ name: dto.name, email: dto.email, passwordHash });
    await this.adminRepo.save(user);

    return this.buildToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.status === 'pending') {
      throw new UnauthorizedException('Please activate your account first. Check your email for the activation link.');
    }

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.buildToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.adminRepo.findOne({ where: { email } });
    const genericResponse = { message: 'If that email is registered, a reset link has been sent.' };

    if (!user) return genericResponse;

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await this.adminRepo.save(user);

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    await this.mailService.sendPasswordResetEmail(user.email, resetUrl);

    return genericResponse;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.adminRepo.findOne({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('This reset link is invalid or has expired.');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from your current password.');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await this.adminRepo.save(user);

    return { message: 'Password has been reset. You can now log in.' };
  }

  private buildToken(user: AdminUser) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        permissions: user.role === 'SuperAdmin' ? null : user.permissions,
      },
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto, avatarUrl?: string) {
    const user = await this.adminRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const firstName = dto.firstName?.trim();
    const lastName = dto.lastName?.trim();

    if (firstName || lastName) {
      const existingParts = user.name.split(' ');
      const newFirst = firstName ?? existingParts[0] ?? '';
      const newLast = lastName ?? existingParts.slice(1).join(' ');
      user.name = [newFirst, newLast].filter(Boolean).join(' ');
    }

    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }

    await this.adminRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }

  async inviteAdmin(dto: InviteAdminDto) {
    const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const token = crypto.randomBytes(32).toString('hex');
    const user = this.adminRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: null as any,
      status: 'pending',
      permissions: dto.permissions ?? DEFAULT_PERMISSIONS,
      activationToken: token,
      activationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await this.adminRepo.save(user);

    const activationUrl = `http://localhost:5173/activate-account?token=${token}`;
    await this.mailService.sendAdminInviteEmail(dto.email, dto.name, activationUrl);

    return { message: `Invitation sent to ${dto.email}` };
  }

  async activateAccount(token: string, password: string) {
    const user = await this.adminRepo.findOne({ where: { activationToken: token } });

    if (!user || !user.activationTokenExpiry || user.activationTokenExpiry < new Date()) {
      throw new BadRequestException('This activation link is invalid or has expired.');
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.status = 'active';
    user.activationToken = null;
    user.activationTokenExpiry = null;
    await this.adminRepo.save(user);

    return this.buildToken(user);
  }

  async listAdmins() {
    return this.adminRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        avatarUrl: true,
        permissions: true,
      },
      order: { createdAt: 'ASC' },
    });
  }

  async updatePermissions(adminId: number, permissions: Record<string, boolean>) {
    const user = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!user) throw new NotFoundException('Admin not found');

    if (user.role === 'SuperAdmin') {
      throw new BadRequestException('Cannot modify permissions for a SuperAdmin');
    }

    user.permissions = permissions;
    await this.adminRepo.save(user);

    return { id: user.id, permissions: user.permissions };
  }
}

function domainAcceptsMail(email: string): Promise<boolean> {
  const domain = email.split('@')[1];
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      resolve(!err && addresses.length > 0);
    });
  });
}