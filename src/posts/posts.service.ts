import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  // ── Public: only published posts (used by Al-Nada website) ────────────────
  async findPublished() {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Admin: all posts including drafts ─────────────────────────────────────
  async findAll() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // ── Public: single post by ID ─────────────────────────────────────────────
  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  // ── Admin: create post ────────────────────────────────────────────────────
  async create(dto: CreatePostDto) {
    return this.prisma.post.create({ data: dto });
  }

  // ── Admin: update post ────────────────────────────────────────────────────
  async update(id: string, dto: UpdatePostDto) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.post.update({ where: { id }, data: dto });
  }

  // ── Admin: delete post + cleanup Cloudinary assets ────────────────────────
  async remove(id: string) {
    const post = await this.findOne(id);

    // Clean up Cloudinary images (fire-and-forget, don't block response)
    const cleanupIds = [post.image1Id, post.image2Id].filter(Boolean) as string[];
    if (cleanupIds.length > 0) {
      Promise.all(cleanupIds.map((pid) => this.cloudinary.destroy(pid))).catch(
        (e) => console.warn('[posts/delete] Cloudinary cleanup failed:', e),
      );
    }

    await this.prisma.post.delete({ where: { id } });
    return { success: true };
  }
}
