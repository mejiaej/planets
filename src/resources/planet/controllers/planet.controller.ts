import { PrismaService } from '@/db/prisma/services/prisma.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanetService } from '../services/planet.services';

@ApiTags('Planets')
@Controller('planets')
export class PlanetController {
  constructor(
    private prismaService: PrismaService,
    private planetService: PlanetService,
  ) {}

  @Get()
  @ApiQuery({
    name: 'name',
    description: 'name of the planet to look for',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'skip',
    description: 'number records to skip in paginated serach',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'take',
    description: 'number of records to retrive in paginated serach',
    required: false,
    type: Number,
  })
  @ApiOperation({ summary: 'List all planets, or find one by name' })
  planets(
    @Query('name') name?: string,
    @Query('skip') skip = '0',
    @Query('take') take = '5',
  ) {
    return this.planetService.getPlanets(name, Number(skip), Number(take));
  }
}
