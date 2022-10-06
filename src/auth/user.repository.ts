import * as bcrypt from 'bcrypt';
import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDTO: AuthCredentialsDTO) {
    const { email, password } = authCredentialsDTO;

    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hashSync(password, salt);

    const user = this.create({ email, password: passwordHash });

    try {
      await this.save(user);

      delete user.password;

      return { message: 'User created successfully', user };
    } catch (error) {
      console.log('error: ', error);
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }
}
