import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.softDeleteMiddleware();
    await this.filterSoftDeleteMiddleware();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Middleware to change all DELETE actions for Soft deletes instead
   *
   * @returns Promise<void>
   */
  async softDeleteMiddleware() {
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date().toJSON() };
      } else if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deletedAt'] = new Date().toJSON();
        } else {
          params.args['data'] = { deletedAt: new Date().toJSON() };
        }
      }

      return await next(params);
    });
  }

  /**
   * Middleware to filter all soft deleted records out of responses
   *
   * @returns Promise<void>
   */
  async filterSoftDeleteMiddleware() {
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      const actions = ['findFirst', 'findMany', 'findFirstOrThrow'];

      if (params.action === 'findUnique') {
        params.action = 'findFirst';
      }

      // disable error bacuse PrismaAction interface doesn't have the values 'findUniqueOrThrow' && 'findFirstOrThrow'
      // even though they actually exists
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (params.action === 'findUniqueOrThrow') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        params.action = 'findFirstOrThrow';
      }

      if (actions.includes(params.action)) {
        // in case deleted records are not explicitly requested
        // return only non soft-deleted records
        if (!params.args.where) {
          params.args.where = { deletedAt: null };
        } else {
          params.args.where['deletedAt'] = null;
        }
      }

      return await next(params);
    });
  }
}
