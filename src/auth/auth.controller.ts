import { AuthService } from 'src/auth/auth.service';
import { Login } from 'src/auth/dtos/login.dto';
import { Signup } from 'src/auth/dtos/signup.dto';
import { CurrentUser } from 'src/auth/guards/CurrentUser';
import { RequestWithUser, UseJwtAuthGuard } from 'src/auth/guards/JwtGuard';
import { Serialize } from 'src/web/common/interceptors/serialize.interceptor';
import { Body, ConflictException, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from '../web/dtos/user/user.dto';
import { match } from 'ts-pattern';
import { ApiController } from '@/web/base.controller';

@Controller('auth')
@ApiTags('auth')
export class AuthController extends ApiController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('signup')
  @ApiBody({ schema: Signup.OpenApi })
  public async signup(@Body() signupDto: Signup.Dto) {
    const result = await this.authService.signup(signupDto);

    return result.unwrapOrElse((error) =>
      match(error)
        .with({ type: 'UserAlreadyExistsError' }, (error) => {
          const ex = new ConflictException(error.message, { cause: error });
          return this.wrapError(ex);
        })
        .exhaustive(),
    );
  }

  @Post('login')
  @ApiBody({ schema: Login.OpenApi })
  public async login(@Body() user: Login.Dto) {
    const result = await this.authService.login(user);

    return result.unwrapOrElse((error) =>
      match(error)
        .with({ type: 'UsernameOrPasswordIsNotCorrectError' }, (error) => {
          const ex = new ConflictException(error.message, { cause: error });
          return this.wrapError(ex);
        })
        .exhaustive(),
    );
    return;
  }

  @UseJwtAuthGuard()
  @Serialize(GetUserDto)
  @ApiOkResponse({ type: GetUserDto })
  @Get('me')
  public me(@CurrentUser() user: RequestWithUser['user']) {
    return user;
  }
}
