import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class SignUploadDto {
  @IsString()
  folder: string;
}

@UseGuards(JwtAuthGuard)
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private cloudinary: CloudinaryService) {}

  // POST /api/cloudinary/sign-upload
  @Post('sign-upload')
  signUpload(@Body() dto: SignUploadDto) {
    return this.cloudinary.signUpload(dto.folder);
  }

  // DELETE /api/cloudinary/:publicId
  @Delete(':publicId')
  async destroy(@Param('publicId') publicId: string) {
    await this.cloudinary.destroy(publicId);
    return { success: true };
  }
}
