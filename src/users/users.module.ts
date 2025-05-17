import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { User as MongoUser, UserSchema } from './schemas/user.schema';
import { MysqlRepository } from './repositories/mysql.repository';
import { MongodbRepository } from './repositories/mongodb.repository';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

const CommandHandlers = [CreateUserHandler];
const QueryHandlers = [GetUserHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: MongoUser.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    MysqlRepository,
    MongodbRepository,
    ...CommandHandlers,
    ...QueryHandlers,
    UserService
  ],
  exports: [MysqlRepository, MongodbRepository,UserService],
})
export class UsersModule {} 