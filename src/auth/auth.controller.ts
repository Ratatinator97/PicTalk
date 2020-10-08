import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Put,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { EditUserDto } from './dto/edit-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    this.logger.verbose(
      `User with Dto: "${createUserDto}" is trying to Sign Up`,
    );
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    this.logger.verbose(
      `User "${authCredentialsDto.username}" is trying to Sign In`,
    );
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/resetPassword')
  resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    this.logger.verbose(
      `User "${resetPasswordDto.username}" is trying to Reset Password`,
    );
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('/details')
  @UseGuards(AuthGuard())
  getUserDetails(@GetUser() user: User): Promise<User> {
    this.logger.verbose(`User "${user.username}" is trying to get Details`);
    return this.authService.getUserDetails(user);
  }

  @Put('/details')
  @UseGuards(AuthGuard())
  editUser(
    @GetUser() user: User,
    @Body(ValidationPipe) editUserDto: EditUserDto,
  ): Promise<void> {
    this.logger.verbose(`User "${user.username}" is trying to modify Details`);
    return this.authService.editUser(user, editUserDto);
  }
}
