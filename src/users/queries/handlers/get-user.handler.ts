import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../get-user.query';
import { MongodbRepository } from '../../repositories/mongodb.repository';
import { IUser } from '../../interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly mongodbRepository: MongodbRepository) {}

  async execute(query: GetUserQuery): Promise<IUser> {
    const { email } = query;
    const user = await this.mongodbRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
} 