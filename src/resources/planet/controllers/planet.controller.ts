import { PrismaService } from '@/db/prisma/services/prisma.service';
import { Controller, Get } from '@nestjs/common';
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
  async planets() {
    const result = await this.planetService.getUsers({});
    console.log('result', result);
  }
}
