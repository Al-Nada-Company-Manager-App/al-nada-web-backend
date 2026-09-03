import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  /** Returns signed upload params so the browser uploads directly to Cloudinary */
  signUpload(folder: string): {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
  } {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      this.config.get('CLOUDINARY_API_SECRET')!,
    );
    return {
      timestamp,
      signature,
      apiKey: this.config.get('CLOUDINARY_API_KEY')!,
      cloudName: this.config.get('CLOUDINARY_CLOUD_NAME')!,
      folder,
    };
  }

  /** Deletes a Cloudinary asset by publicId */
  async destroy(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
