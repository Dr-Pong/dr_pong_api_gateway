import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserSignUpDto } from './dto/update.user.signup.dto';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({ where: { email } });
  }

  async findByNickname(nickname: string): Promise<User> {
    return await this.repository.findOne({ where: { nickname } });
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.repository.save({ email: createDto.email });
  }

  async signUp(updateDto: UpdateUserSignUpDto): Promise<void> {
    updateDto.user.image = updateDto.profileImage;
    updateDto.user.nickname = updateDto.nickname;
    await this.repository.save(updateDto.user);
  }

  async updateSecondAuth(user: User, secretKey: string) {
    user.secondAuthSecret = secretKey;
    await this.repository.save(user);
  }
}
