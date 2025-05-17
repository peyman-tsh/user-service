import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IUserResponse } from "./interfaces/user.interface";
import { CreateUserCommand } from "./commands/create-user.command";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()

export class UserService {
    constructor(private readonly commandBus:CommandBus){}

  async createUser(createUserDto:CreateUserDto):Promise<IUserResponse>{
    console.log('in user micro');
    
   return await this.commandBus.execute(new CreateUserCommand(createUserDto));
    
  }

}