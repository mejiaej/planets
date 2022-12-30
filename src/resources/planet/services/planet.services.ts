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

  async getPlanetById(id: number): Promise<Planet> {
    return this.prismaService.planet.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async deleteById(id: number) {
    return this.prismaService.planet.delete({
      where: {
        id,
      },
    });
  }

  private async findPlanetByNameFromAPI(nameParam: string): Promise<Planet[]> {
    const {
      data: { results: apiPlanets },
    } = await firstValueFrom(
      this.httpService.get(`${PLANETS_URL}?search=${nameParam}`),
    );

    if (!apiPlanets?.length) return [];

    const matchedPlanet = apiPlanets.some(
      (apiPlanet: { name: string }) => apiPlanet.name === nameParam,
    );
    if (matchedPlanet) {
      const insertPlanets = apiPlanets.map((apiPlanet: any) => {
        // change to .createMany and avoid map/PromiseAll when switching to PostgreSql
        // SqlLite doesn't support .createMany
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
