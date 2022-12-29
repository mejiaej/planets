import { PrismaService } from '@/db/prisma/services/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Planet } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PLANETS_URL } from '../planet.constants';

@Injectable()
export class PlanetService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getPlanets(nameParam?: string): Promise<Planet[]> {
    if (!nameParam) {
      return this.prismaService.planet.findMany();
    } else {
      const planets = await this.findPlanetByName(nameParam);
      if (planets?.length) {
        return planets;
      } else {
        return this.findPlanetByNameFromAPI(nameParam);
      }
    }
  }

  private async findPlanetByNameFromAPI(nameParam: string): Promise<Planet[]> {
    const {
      data: { results },
    } = await firstValueFrom(
      this.httpService.get(`${PLANETS_URL}?search=${nameParam}`),
    );

    if (results?.length) {
      const insertPlanets = results.map((apiPlanet: any) => {
        return this.prismaService.planet.create({
          data: {
            name: apiPlanet.name,
            diameter: apiPlanet.diameter,
            gravity: apiPlanet.gravity,
            terrain: apiPlanet.terrain,
            createdAt: apiPlanet.created,
            updatedAt: apiPlanet.edited,
          },
        });
      });

      await Promise.all(insertPlanets);

      return this.findPlanetByName(nameParam);
    } else {
      return [];
    }
  }

  private async findPlanetByName(nameParam: string): Promise<Planet[]> {
    return this.prismaService.planet.findMany({
      where: {
        name: nameParam,
      },
    });
  }
}
