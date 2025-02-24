import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassWord } from '../utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassWord(createUserDto.password);
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number, options: Prisma.UserDefaultArgs = {}) {
    return this.prisma.user.findUnique({ where: { id }, ...options });
  }

  async update(
    filter: Prisma.UserUpdateArgs['where'],
    updateUserDto: Prisma.UserUpdateInput,
  ) {
    return await this.prisma.user.update({
      where: filter,
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }
}
