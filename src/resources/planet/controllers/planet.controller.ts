import { PrismaService } from '@/db/prisma/services/prisma.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlanetService } from '../services/planet.services.module';

@ApiTags('Planets')
@Controller('planets')
export class PlanetController {
  constructor(
    private prismaService: PrismaService,
    private planetService: PlanetService,
  ) {}

  @Get()
  planets(@Query('name') name?: string) {
    return this.planetService.getPlanets(name);
  }
}
