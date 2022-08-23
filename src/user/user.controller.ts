import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { getPaginationData } from 'src/utils/helpers';
import { UserFilterDto } from './dto/get-user.dto';
import { CreateUserDto, UserVerificationDto } from './dto/user-create.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.userService.getHarsh();
  }

  @Post('create')
  create(@Body() data: UserVerificationDto) {
    return this.userService.create(data);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    const filters: UserFilterDto = req.query;
    const page = +filters.page || 1;
    const take = +filters.limit || 20;
    const skip = take * (page - 1);
    const where = this.userService.generateFilterCondition(filters);
    const orderBy = this.userService.generateOrderCondition(filters.order);
    const count = await this.userService.getCount(where);
    const data = await this.userService.findAll({
      where,
      skip,
      take,
      orderBy,
    });
    return getPaginationData({
      paginationDetails: {
        page,
        take,
      },
      result: {
        count,
        data,
      },
    });
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('userId') userId: number) {
    return this.userService.findUnique({
      id: +userId,
    });
  }
  @Patch('update/:userId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('userId') userId: number,
    @Body() updateUserDto: CreateUserDto,
  ) {
    const data = await this.userService.update({
      data: updateUserDto,
      where: {
        id: +userId,
      },
    });
    return {
      message: 'Updated',
      data,
    };
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('userId') userId: number) {
    return this.userService.delete({
      id: +userId,
    });
  }
}
