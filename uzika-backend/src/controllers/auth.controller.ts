import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/auth/signup.dto';
import { LoginDto } from '../dto/auth/login.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { ForgotPasswordDto } from '../dto/auth/forgot-password.dto';
import { ResetPasswordDto } from '../dto/auth/reset-password.dto';
import { Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateProfileDto } from '../dto/auth/update-profile.dto';
import { InviteAdminDto } from '../dto/auth/invite-admin.dto';
import { ActivateAccountDto } from '../dto/auth/activate-account.dto';
import { UpdatePermissionsDto } from '../dto/auth/update-permissions.dto';
import { Param } from '@nestjs/common';
import { SuperAdminGuard } from '../guard/super-admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  updateMe(
    @Request() req: any,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const avatarUrl = file ? `/uploads/avatars/${file.filename}` : undefined;
    return this.authService.updateProfile(req.user.userId, dto, avatarUrl);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post('invite')
  inviteAdmin(@Body() dto: InviteAdminDto) {
    return this.authService.inviteAdmin(dto);
  }

  @Post('activate')
  activateAccount(@Body() dto: ActivateAccountDto) {
    return this.authService.activateAccount(dto.token, dto.password);
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Get('admins')
  listAdmins() {
    return this.authService.listAdmins();
  }

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Patch('admins/:id/permissions')
  updatePermissions(@Param('id') id: string, @Body() dto: UpdatePermissionsDto) {
    return this.authService.updatePermissions(+id, dto.permissions);
  }
}