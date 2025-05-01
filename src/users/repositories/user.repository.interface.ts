import { IUser } from '../interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';

export interface IUserRepository {
  create(user: CreateUserDto): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, user: Partial<IUser>): Promise<IUser>;
  delete(id: string): Promise<void>;
} 