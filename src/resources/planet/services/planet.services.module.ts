import { PrismaService } from '@/db/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Planet } from '@prisma/client';

@Injectable()
export class PlanetService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PlanetWhereUniqueInput;
    where?: Prisma.PlanetWhereInput;
    orderBy?: Prisma.PlanetOrderByWithRelationInput;
  }): Promise<Planet[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prismaService.planet.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
}
