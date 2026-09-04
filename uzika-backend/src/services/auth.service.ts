import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser) private adminRepo: Repository<AdminUser>,
    private jwtService: JwtService,
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

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return this.buildToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.adminRepo.findOne({ where: { email } });
    const genericResponse = { message: 'If that email is registered, a reset link has been sent.' };

    if (!user) return genericResponse; // don't reveal whether the email exists

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    await this.adminRepo.save(user);

    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    // TODO: replace with real email sending (Nodemailer) once you have an email provider set up.
    console.log('--- PASSWORD RESET LINK (dev only) ---');
    console.log(resetUrl);
    console.log('---------------------------------------');

    return { ...genericResponse, devResetUrl: resetUrl }; // remove devResetUrl before production
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.adminRepo.findOne({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('This reset link is invalid or has expired.');
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
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
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