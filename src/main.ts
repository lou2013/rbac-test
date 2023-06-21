import { NestFactory } from '@nestjs/core';
import { SerializerInterceptor } from './common/interceptors/serializer.interceptor';
import { GlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger';
import { ErrorFilter } from './common/filter/error.filter';
import { AppModule } from './app.module';
import {
  ParameterObject,
  ReferenceObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalInterceptors(SerializerInterceptor(app));
  app.useGlobalFilters(new ErrorFilter());
  const document = new DocumentBuilder()
    .setTitle('maria')
    .setDescription('description')
    .setVersion('v1')
    .addBearerAuth();
  const openApiObject = SwaggerModule.createDocument(app, document.build());
  SwaggerModule.setup('docs/index', app, fixSwaggerQuery(openApiObject), {});
  await app.listen(3000);
}
bootstrap();

//without this query is rendered twice in swagger
const fixSwaggerQuery = (document: OpenAPIObject): OpenAPIObject => {
  const distinctParameters: (
    array: any,
  ) => (ParameterObject | ReferenceObject)[] = (array) =>
    [
      ...new Map(
        array.map((item) => [item.in + item.name + item.$ref, item]),
      ).values(),
    ] as (ParameterObject | ReferenceObject)[];
  for (const path in document.paths || {}) {
    const pathObject = document.paths[path];
    const methodParameters = [
      { key: 'get', params: pathObject.get?.parameters },
      { key: 'put', params: pathObject.put?.parameters },
      { key: 'post', params: pathObject.post?.parameters },
      { key: 'delete', params: pathObject.delete?.parameters },
      { key: 'options', params: pathObject.options?.parameters },
      { key: 'head', params: pathObject.head?.parameters },
      { key: 'patch', params: pathObject.patch?.parameters },
      { key: 'trace', params: pathObject.trace?.parameters },
    ];
    if (pathObject.parameters) {
      document.paths[path].parameters = distinctParameters(
        document.paths[path].parameters,
      );
    }
    for (const x of methodParameters) {
      if (x.params) {
        document.paths[path][x.key].parameters = distinctParameters(x.params);
      }
    }
  }
  return document;
};
