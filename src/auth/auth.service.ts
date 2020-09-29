import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import * as config from 'config';
@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    return this.userRepository.signUp(createUserDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    const jwtConfig = config.get('jwt');
    const expiresIn = jwtConfig.expiresIn;
    const username = await this.userRepository.validationPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );
    return { accessToken, expiresIn };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const resetTokenValue = randomBytes(20).toString('hex');
    const resetTokenExpiration = String(Date.now() + 3600000);
    return this.userRepository.resetPassword(
      resetPasswordDto,
      resetTokenValue,
      resetTokenExpiration,
    );
  }
  async editUser(user: User, editUserDto: EditUserDto): Promise<void> {
    return this.userRepository.editUser(user, editUserDto);
  }
  async getUserDetails(user: User): Promise<User> {
    return this.userRepository.getUserDetails(user);
  }

  //
}
