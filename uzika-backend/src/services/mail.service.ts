import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Reset your Uzika password',
      html: `
        <p>We received a request to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset your password</a></p>
        <p>This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    });
  }

  async sendAdminInviteEmail(to: string, name: string, activationUrl: string) {
    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'You\u2019ve been invited to Uzika Backoffice',
      html: `
        <p>Hi ${name},</p>
        <p>You've been invited to join the Uzika admin team. Click below to set your password and activate your account:</p>
        <p><a href="${activationUrl}">Activate your account</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }
}