import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashText } from 'src/utils/helpers';
import { PrismaService } from 'src/utils/prisma.service';
import { UserFilterDto, UserOrderDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  getHarsh(): string {
    return 'Hello Harsh Dalsaniya';
  }

  async create(data: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (user) {
      throw new HttpException('User already exist.', HttpStatus.BAD_REQUEST);
    }
    if (data.password) {
      data.password = await hashText(data.password);
    }
    const createdUser = await this.prisma.user.create({
      data,
    });
    const { password, ...rest } = createdUser;
    return rest;
  }

  generateFilterCondition(filters: UserFilterDto): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (filters.search) {
      where.OR = [
        {
          firstName: {
            contains: filters.search,
          },
        },
        {
          lastName: {
            contains: filters.search,
          },
        },
        {
          email: {
            contains: filters.search,
          },
        },
      ];
    }

    return where;
  }

  generateOrderCondition(
    orderRawData = '{}',
  ): Array<Prisma.UserOrderByWithRelationInput> {
    const order: UserOrderDto = JSON.parse(orderRawData);
    const orderBy: Array<Prisma.UserOrderByWithRelationInput> = [];
    if (order.email) {
      orderBy.push({
        email: order.email,
      });
    }

    if (order.firstName) {
      orderBy.push({
        firstName: order.firstName,
      });
    }
    if (order.lastName) {
      orderBy.push({
        lastName: order.lastName,
      });
    }

    return orderBy;
  }

  async getCount(where: Prisma.UserWhereInput) {
    return await this.prisma.user.count({
      where: {
        ...where,
      },
    });
  }

  async findAll(params?: Prisma.UserFindManyArgs) {
    const userData = await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
      },
      where: { ...params.where },
      ...params,
    });
    return userData;
  }

  async findUnique(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({ where });
    return user;
  }
  async findOne(where: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirst({
      where,
    });
  }

  async update(params: {
    data: UpdateUserDto;
    where: Prisma.UserWhereUniqueInput;
  }) {
    const { where } = params;
    const user = await this.prisma.user.findUnique({ where });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updatedUser = await this.prisma.user.update(params);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      isActive: updatedUser.isActive,
    };
  }

  async delete(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({ where });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.delete({ where });
    return user;
  }
}
