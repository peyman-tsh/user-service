import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../get-user-id-query';
import { MongodbRepository } from '../../repositories/mongodb.repository';
import { IUser } from '../../interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserByIdQuery)
export class GetUserHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly mongodbRepository: MongodbRepository) {}

  async execute(query: GetUserByIdQuery): Promise<IUser> {
    const { id } = query;
    const user = await this.mongodbRepository.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
} 