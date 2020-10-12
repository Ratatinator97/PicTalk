import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EditUserDto } from './dto/edit-user.dto';
import sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('AuthService');
  s;
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, language } = createUserDto;

    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    
    user.resetPasswordToken = '';
    user.resetPasswordExpires = '';

    if (language) {
      user.language = language;
    } else {
      user.language = '';
    }

    try {
      await user.save();
    } catch (error) {
      if (error.code === 23505) {
        //Duplicate Username
        throw new ConflictException('Username already exists');
      } else {
        this.logger.verbose(
          `Problem while saving the User: ${user.username}, error is : ${error} !`,
        );

        throw new InternalServerErrorException(error);
      }
    }
    this.logger.verbose(`User ${user.username} is being saved !`);
  }

  async validationPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    resetTokenValue: string,
    resetTokenExpiration: string,
  ): Promise<void> {
    const { username } = resetPasswordDto;
    const user = await this.findOne({ username });

    user.resetPasswordToken = resetTokenValue;
    user.resetPasswordExpires = resetTokenExpiration;

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    try {
      sgMail.send({
        from: 'pictalk.mail@gmail.com',
        to: 'asidiras.csi@gmail.com',
        subject: 'Your Password Reset Demand',
        text: 'This is a test email',
        html: '<p>This is a test email</p>',
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserDetails(user: User): Promise<User> {
    delete user.password;
    delete user.salt;
    delete user.collections;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    delete user.pictos;
    return user;
  }
  async editUser(user: User, editUserDto: EditUserDto): Promise<void> {
    const { username, language, password } = editUserDto;
    if (username) {
      user.username = username;
    }
    if (language) {
      user.language = language;
    }
    if (password) {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
    }
    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
