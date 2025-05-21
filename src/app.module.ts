import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import configuration from './config/configuration';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { APP_FILTER } from '@nestjs/core';
import { RpcExceptionFilter } from './users/exception/exception.filter';
import { HttpExceptionFilter } from './users/exception/httpException.filter';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.get('database.mysql'),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('rabbitmq.queue'),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [CommandBus, QueryBus,
    {
      provide:APP_FILTER,
      useClass:RpcExceptionFilter
    },
    {
      provide:APP_FILTER,
      useClass:HttpExceptionFilter
    }
  ],
})
export class AppModule {} 