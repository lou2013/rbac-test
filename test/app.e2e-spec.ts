import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserService } from 'src/modules/user/service/user.service';
import { GlobalValidationPipe } from 'src/common/pipes/global-validation.pipe';
import { SerializerInterceptor } from 'src/common/interceptors/serializer.interceptor';
import { ErrorFilter } from 'src/common/filter/error.filter';

describe('authorization', () => {
  let app: INestApplication;
  let adminAuthToken: string;
  let sellAdminAuthToken: string;
  let accountantAdminAuthToken: string;
  let ccAdminToken: string;
  let ccAccountantAdminToken: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(GlobalValidationPipe);
    app.useGlobalInterceptors(SerializerInterceptor(app));
    app.useGlobalFilters(new ErrorFilter());
    await app.init();
    [
      adminAuthToken,
      sellAdminAuthToken,
      accountantAdminAuthToken,
      ccAdminToken,
      ccAccountantAdminToken,
    ] = (
      await Promise.all([
        request(app.getHttpServer()).post('/auth/login').send({
          phoneNumber: '09360074042',
          password: 'Qwerty1234',
        }),
        request(app.getHttpServer()).post('/auth/login').send({
          phoneNumber: '09360074043',
          password: 'Qwerty1234',
        }),
        request(app.getHttpServer()).post('/auth/login').send({
          phoneNumber: '09360074044',
          password: 'Qwerty1234',
        }),
        request(app.getHttpServer()).post('/auth/login').send({
          phoneNumber: '09360074045',
          password: 'Qwerty1234',
        }),
        request(app.getHttpServer()).post('/auth/login').send({
          phoneNumber: '09360074046',
          password: 'Qwerty1234',
        }),
      ])
    ).map((res) => res.body.accessToken);
  });

  afterAll(async () => {
    await app.close();
  });

  it('(GET) /login ', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        phoneNumber: '09360074042',
        password: 'Qwerty1234',
      })
      .expect(201);
  });

  it('(GET) /user with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${adminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /comment with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/comment')
      .set('Authorization', `Bearer ${adminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /order with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${adminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /product with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/product')
      .set('Authorization', `Bearer ${adminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  //sell admin

  it('(GET) /user with SELL_ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${sellAdminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /comment with SELL_ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/comment')
      .set('Authorization', `Bearer ${sellAdminAuthToken}`);
    expect(result.statusCode).toBe(403);
  });

  it('(GET) /order with SELL_ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${sellAdminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /product with SELL_ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/product')
      .set('Authorization', `Bearer ${sellAdminAuthToken}`);
    expect(result.statusCode).toBe(403);
  });

  // accountant Admin

  it('(GET) /user with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accountantAdminAuthToken}`);
    expect(result.statusCode).toBe(403);
  });

  it('(GET) /comment with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/comment')
      .set('Authorization', `Bearer ${accountantAdminAuthToken}`);
    expect(result.statusCode).toBe(403);
  });

  it('(GET) /order with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${accountantAdminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /product with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/product')
      .set('Authorization', `Bearer ${accountantAdminAuthToken}`);
    expect(result.statusCode).toBe(200);
  });

  //cc Admin

  it('(GET) /user with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${ccAdminToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /comment with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/comment')
      .set('Authorization', `Bearer ${ccAdminToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /order with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${ccAdminToken}`);
    expect(result.statusCode).toBe(403);
  });

  it('(GET) /product with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/product')
      .set('Authorization', `Bearer ${ccAdminToken}`);
    expect(result.statusCode).toBe(403);
  });

  //cc accountant Admin

  it('(GET) /user with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${ccAccountantAdminToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /comment with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/comment')
      .set('Authorization', `Bearer ${ccAccountantAdminToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /order with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/order')
      .set('Authorization', `Bearer ${ccAccountantAdminToken}`);
    expect(result.statusCode).toBe(200);
  });

  it('(GET) /product with ADMIN role ', async () => {
    const result = await request(app.getHttpServer())
      .get('/product')
      .set('Authorization', `Bearer ${ccAccountantAdminToken}`);
    expect(result.statusCode).toBe(200);
  });
});
