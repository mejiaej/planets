import { AuthGuard } from '@/core/guards/auth.guard';
import { PrismaService } from '@/db/prisma/services/prisma.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListPlanetRequestDto } from '../dto/list-planet-request.dto';
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
  getPlanets(@Query() query: ListPlanetRequestDto) {
    return this.planetService.getPlanets(query.name, query.skip, query.take);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Id of the planet to look for',
    required: true,
    type: Number,
  })
  getPlanetById(@Param('id', new ParseIntPipe()) id: number) {
    return this.planetService.getPlanetById(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Id of the planet to delete',
    required: true,
    type: Number,
  })
  deletePlanetById(@Param('id', new ParseIntPipe()) id: number) {
    return this.planetService.deleteById(id);
  }
}
