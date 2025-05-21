import { Controller, Post, UseFilters } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from './queries/get-user.query';
import { RpcExceptionFilter } from './exception/exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './interfaces/user.interface';
import { UserService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(
    private readonly userService:UserService,
    private readonly queryBus: QueryBus,
  ) {}
  
  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<IUserResponse> {
   return await this.userService.createUser(createUserDto)
  }
  @MessagePattern({ cmd: 'findById' })
  async getUser(@Payload() data: { id: string }): Promise<IUserResponse> {
    const user = await this.queryBus.execute(new GetUserQuery(data.id));
    return this.mapToResponse(user);
  }

  @MessagePattern({ cmd: 'validateUser' })
  async validateUser(@Payload() data: { email: string; password: string }): Promise<IUserResponse> {
    // Find user by email for validation
    const user = await this.queryBus.execute(new GetUserQuery(data.email));
    if (!user) {
      throw new Error('User not found');
    }
    // Here you should validate the password, e.g. using bcrypt
    // For demonstration, assuming user.password is plain text (not recommended in production)
    if (user.password !== data.password) {
      throw new Error('Invalid credentials');
    }
    return this.mapToResponse(user);
  }
  private mapToResponse(user: any): IUserResponse {
    const { password, ...userResponse } = user.toObject();
    return userResponse;
  }
} 