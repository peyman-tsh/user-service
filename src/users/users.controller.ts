import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { GetUserQuery } from './queries/get-user.query';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserResponse } from './interfaces/user.interface';

@Controller()
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.commandBus.execute(new CreateUserCommand(createUserDto));
    return this.mapToResponse(user);
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