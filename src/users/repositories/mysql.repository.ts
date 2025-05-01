import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class MysqlRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<IUser> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
} 