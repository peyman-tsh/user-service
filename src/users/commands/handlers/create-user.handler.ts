import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { MysqlRepository } from '../../repositories/mysql.repository';
import { IUser } from '../../interfaces/user.interface';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MongodbRepository } from 'src/users/repositories/mongodb.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly mysqlRepository: MysqlRepository,private readonly mongodbRepository:MongodbRepository) {}

  async execute(command: CreateUserCommand): Promise<IUser> {
    const { createUserDto } = command;

    const existingUser = await this.mysqlRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.mysqlRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    if(user){
    await this.mongodbRepository.create({
      ...createUserDto,
      password:hashedPassword
    })
    }
    return user;
  }
} 