import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // ── Public endpoints ───────────────────────────────────────────────────────

  /** GET /api/posts — returns only published posts (used by Al-Nada website) */
  @Get()
  findPublished() {
    return this.postsService.findPublished();
  }

  /** GET /api/posts/:id — returns a single post by ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // ── Protected (admin only) ─────────────────────────────────────────────────

  /** GET /api/posts/admin/all — returns ALL posts including drafts */
  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAll() {
    return this.postsService.findAll();
  }

  /** POST /api/posts — create a new post */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  /** PATCH /api/posts/:id — update existing post */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  /** DELETE /api/posts/:id — delete post + cleanup Cloudinary */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
