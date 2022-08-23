import { Prisma } from '@prisma/client';

export class UserFilterDto {
  search?: string;
  order?: string;
  page?: string;
  limit?: string;
  endDate?: string;
}
export class UserOrderDto {
  firstName?: Prisma.SortOrder;
  lastName?: Prisma.SortOrder;
  email?: Prisma.SortOrder;
}
