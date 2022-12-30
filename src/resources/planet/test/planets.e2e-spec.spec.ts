import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { STATIC_TOKEN } from '@/core/guards/auth.guard';

describe('Planets', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`Get planet by name Tatooine`, async () => {
    const response = await request(app.getHttpServer()).get(
      '/planets?name=Tatooine',
    );

    expect(response.status).toBe(200);
    expect(response.body[0]?.name).toEqual('Tatooine');
    expect(response.body[0]?.diameter).not.toBe('');
    expect(response.body[0]?.gravity).not.toBe('');
    expect(response.body[0]?.terrain).not.toBe('');
  });

  it(`Fetches planet by id`, async () => {
    const response = await request(app.getHttpServer()).get(
      '/planets?name=Tatooine',
    );
    expect(response.status).toBe(200);

    const fetchResponse = await request(app.getHttpServer())
      .get(`/planets/${response.body[0].id}`)
      .set('authorization', `Bearer ${STATIC_TOKEN}`);

    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body?.name).toEqual('Tatooine');
    expect(fetchResponse.body?.diameter).not.toBe('');
    expect(fetchResponse.body?.gravity).not.toBe('');
    expect(fetchResponse.body?.terrain).not.toBe('');
  });

  it(`Deletes planet by id`, async () => {
    const response = await request(app.getHttpServer()).get(
      '/planets?name=Tatooine',
    );
    expect(response.status).toBe(200);

    const fetchResponse = await request(app.getHttpServer())
      .get(`/planets/${response.body[0].id}`)
      .set('authorization', `Bearer ${STATIC_TOKEN}`);

    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body?.name).toEqual('Tatooine');

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/planets/${response.body[0].id}`)
      .set('authorization', `Bearer ${STATIC_TOKEN}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body?.name).toEqual('Tatooine');
    expect(deleteResponse.body?.deletedAt).not.toBe('');
  });

  afterAll(async () => {
    await app.close();
  });
});
