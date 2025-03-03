import { Injectable } from '@nestjs/common';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createStoryDto: Omit<Prisma.StoryCreateInput, 'createdUser'>,
    userId: number,
  ) {
    return await this.prisma.story.create({
      data: { ...createStoryDto, createdUser: { connect: { id: userId } } },
    });
  }

  async findAll(filter: Prisma.StoryFindManyArgs['where']) {
    return await this.prisma.story.findMany({ where: filter });
  }

  async findOne(filter: Prisma.StoryFindUniqueArgs['where']) {
    return await this.prisma.story.findUnique({ where: filter });
  }

  update(id: number, updateStoryDto: UpdateStoryDto) {
    return `This action updates a #${id} story`;
  }

  remove(id: number) {
    return `This action removes a #${id} story`;
  }
}
