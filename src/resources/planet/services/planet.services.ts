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

  async getPlanets(nameParam?: string, skip = 0, take = 5): Promise<Planet[]> {
    if (!nameParam) {
      return this.prismaService.planet.findMany({ skip, take });
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
      data: { results: apiPlanets },
    } = await firstValueFrom(
      this.httpService.get(`${PLANETS_URL}?search=${nameParam}`),
    );

    if (!apiPlanets?.length) return [];

    const matchedPlanet = apiPlanets.find(
      (apiPlanet: { name: string }) => apiPlanet.name === nameParam,
    );
    if (matchedPlanet) {
      await this.prismaService.planet.create({
        data: {
          name: matchedPlanet.name,
          diameter: matchedPlanet.diameter,
          gravity: matchedPlanet.gravity,
          terrain: matchedPlanet.terrain,
          createdAt: matchedPlanet.created,
          updatedAt: matchedPlanet.edited,
        },
      });
    }

    return this.findPlanetByName(nameParam);
  }

  private async findPlanetByName(nameParam: string): Promise<Planet[]> {
    return this.prismaService.planet.findMany({
      where: {
        name: nameParam,
      },
    });
  }
}
