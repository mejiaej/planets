import { PrismaModule } from '@/db/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PlanetController } from './controllers/planet.controller';
import { PlanetService } from './services/planet.services.module';

@Module({
  imports: [TerminusModule, PrismaModule, HttpModule],
  controllers: [PlanetController],
  providers: [PlanetService],
})
export class PlanetModule {}
