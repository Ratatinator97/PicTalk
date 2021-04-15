import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Put,
  UseGuards,
  Logger,
  Param,
  Inject,
  forwardRef,
  InternalServerErrorException,
  OnModuleInit
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { EditUserDto } from './dto/edit-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PictoService } from 'src/pictos/pictos.service';
import { CollectionService } from 'src/pictos/collection.service';
import { Collection } from 'src/pictos/collection.entity';
import { Picto } from 'src/pictos/picto.entity';
import { ModuleRef } from '@nestjs/core';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService,
    @Inject(forwardRef(() => PictoService))
    private pictoService: PictoService,
    @Inject(forwardRef(() => CollectionService))
    private collectionService: CollectionService) { }

  @Post('/signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    this.logger.verbose(
      `User with username: "${createUserDto.username}" is trying to Sign Up`,
    );
    const user = await this.authService.signUp(createUserDto);
    this.logger.verbose(
      `Created user: "${user.username}"`,
    );
    if (!user) {
      throw new InternalServerErrorException(`Couldn't create user ${createUserDto.username}`);
    }
    const collections: Collection[] = await this.collectionService.createStarterCollections(user);
    this.logger.verbose(
      `Created collections for user: "${createUserDto.username}"`,
    );
    await this.pictoService.createStarterPackPictosForCollection(user, collections);
    this.logger.verbose(
      `Created pictograms for user: "${createUserDto.username}"`,
    );
    return;
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
  @Post('/changePassword/:token')
  changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @Param('token') token: string,
  ): Promise<void> {
    this.logger.verbose(
      `${token} is being used !`,
    );
    return this.authService.changePassword(changePasswordDto, token);
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
