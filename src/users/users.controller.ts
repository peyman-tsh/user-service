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
     return await this.userService.validateUser(data.email,data.password);
  }
  private mapToResponse(user: any): IUserResponse {
    const { password, ...userResponse } = user.toObject();
    return userResponse;
  }
} 