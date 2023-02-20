import { AuthService } from '@/auth/auth.service';
import { Login } from '@/auth/dtos/login.dto';
import { Signup } from '@/auth/dtos/signup.dto';
import { CurrentUser } from '@/auth/guards/CurrentUser';
import { RequestWithUser, UseJwtAuthGuard } from '@/auth/guards/JwtGuard';
import { Serialize } from '@/web/common/interceptors/serialize.interceptor';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from '../web/dtos/user/user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ schema: Signup.OpenApi })
  public signup(@Body() signupDto: Signup.Dto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiBody({ schema: Login.OpenApi })
  public login(@Body() user: Login.Dto) {
    return this.authService.login(user);
  }

  @UseJwtAuthGuard()
  @Serialize(GetUserDto)
  @ApiOkResponse({ type: GetUserDto })
  @Get('me')
  public me(@CurrentUser() user: RequestWithUser['user']) {
    return user;
  }
}
