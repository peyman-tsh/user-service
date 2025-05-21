import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { IUserResponse } from "./interfaces/user.interface";
import { CreateUserCommand } from "./commands/create-user.command";
import { CreateUserDto } from "./dto/create-user.dto";
import { GetUserQuery } from "./queries/get-user.query";
import * as bcrypt from 'bcrypt';
@Injectable()

export class UserService {
 constructor(private readonly commandBus:CommandBus,
  private readonly queryBus:QueryBus
 ){}

  async createUser(createUserDto:CreateUserDto):Promise<IUserResponse>{
    console.log('in user micro');
    
   return await this.commandBus.execute(new CreateUserCommand(createUserDto));
    
  }

  async validateUser(email:string,password:string):Promise<IUserResponse>{
    const user = await this.queryBus.execute(new GetUserQuery(email));
    if (!user) {
      throw new Error('User not found');
    }
    // Here you should validate the password, e.g. using bcrypt
    const passwordMatch=await bcrypt.compare(password,user.password)
    // For demonstration, assuming user.password is plain text (not recommended in production)
    console.log(passwordMatch);
    
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    return user
  }
}