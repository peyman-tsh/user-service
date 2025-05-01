import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class MongodbRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<IUser | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return user
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => ({
      id: user.id,
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
} 