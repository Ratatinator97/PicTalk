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
import { StarterCollectionDto } from 'src/pictos/dto/starterCollection.dto';
import { StarterPictoDto } from 'src/pictos/dto/starterPicto.dto';
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  private FRstarterCollections;
  private FRpictograms;

  private ESstarterCollections;
  private ESpictograms;

  private ENstarterCollections;
  private ENpictograms;

  constructor(private authService: AuthService,
    @Inject(forwardRef(() => PictoService))
    private pictoService: PictoService,
    @Inject(forwardRef(() => CollectionService))
    private collectionService: CollectionService) {
    this.FRstarterCollections = require("../starterPack/FRstartingPackCollection.json");
    this.FRpictograms = require("../starterPack/FRstartingPackPictos.json");

    this.ESstarterCollections = require("../starterPack/ESstartingPackCollection.json");
    this.ESpictograms = require("../starterPack/ESstartingPackPictos.json");

    this.ENstarterCollections = require("../starterPack/ENstartingPackCollection.json");
    this.ENpictograms = require("../starterPack/ENstartingPackPictos.json");
  }

  @Post('/signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<void> {
    this.logger.verbose(
      `User with username: "${createUserDto.username}" is trying to Sign Up`,
    );
    const user = await this.authService.signUp(createUserDto);
    this.logger.verbose(
      `Created user: "${user.username}"`,
    );
    let starterCollections: StarterCollectionDto[];
    let pictograms: StarterPictoDto[];
    console.log(createUserDto);
    if (createUserDto.language) {
      switch (createUserDto.language) {
        case "fr-FR":
          console.log("FR");
          starterCollections = this.FRstarterCollections;
          pictograms = this.FRpictograms;
          break;
        case "es-ES":
          console.log("ES");
          starterCollections = this.ESstarterCollections;
          pictograms = this.ESpictograms;
          break;
        case "en-EN":
          console.log("EN");
          starterCollections = this.ENstarterCollections;
          pictograms = this.ENpictograms;
          break;
        default:
          console.log("Default");
          starterCollections = this.FRstarterCollections;
          pictograms = this.FRpictograms;
          break;
      }
    } else {
      starterCollections = this.FRstarterCollections;
      pictograms = this.FRpictograms;
    }
    const collections: Collection[] = await this.collectionService.createStarterCollections(user, starterCollections);
    this.logger.verbose(
      `Created collections for user: "${createUserDto.username}"`,
    );
    await this.pictoService.createStarterPackPictosForCollection(user, collections, pictograms);
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
