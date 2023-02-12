import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Signup } from '@/auth/dtos/signup.dto';
import { Login } from '@/auth/dtos/login.dto';
import { RequestWithUser, UseJwtAuthGuard } from '@/auth/guards/JwtGuard';
import { CurrentUser } from '@/auth/guards/CurrentUser';

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
  @Get('me')
  public me(@CurrentUser() user: RequestWithUser['user']) {
    return user;
  }
}
