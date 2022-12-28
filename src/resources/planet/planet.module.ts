import { PrismaModule } from '@/db/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PlanetController } from './controllers/planet.controller';
import { PlanetService } from './services/planet.services.module';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [PlanetController],
  providers: [PlanetService],
})
export class PlanetModule {}
