import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  body: string;

  @IsOptional()
  @IsUrl()
  image1Url?: string;

  @IsOptional()
  @IsString()
  image1Id?: string;

  @IsOptional()
  @IsUrl()
  image2Url?: string;

  @IsOptional()
  @IsString()
  image2Id?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
