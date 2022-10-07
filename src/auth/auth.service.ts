import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<object> {
    return this.userRepository.createUser(authCredentialsDTO);
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO): Promise<object> {
    const { email, password } = authCredentialsDTO;

    const user = await this.userRepository.findOne({ email });

    if (!user) throw new NotFoundException('User not found');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Wrong password');

    delete user.password;
    delete user.tasks;

    const payload: JwtPayload = { id: user.id, email: user.email };

    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken, ...user };
  }
}
