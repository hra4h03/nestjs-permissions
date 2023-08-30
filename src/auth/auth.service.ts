import { Login } from 'src/auth/dtos/login.dto';
import { Signup } from 'src/auth/dtos/signup.dto';
import { UserAlreadyExistsError } from 'src/auth/errors/UserAlreadyExists.error';
import { UsernameOrPasswordIsNotCorrect } from 'src/auth/errors/UsernameOrPasswordIsNotCorrect.error';
import { Role } from '@aggregates/user/role/role';
import { User } from '@aggregates/user/user.aggregate';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Result } from '@/common/primitives/Result';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(
    signupDto: Signup.Dto,
  ): Promise<Result<string, UserAlreadyExistsError>> {
    const roleSet = this.em.getRepository(Role);

    const isExist = await this.em.findOne<User>(User, {
      name: signupDto.username,
    });
    if (isExist) {
      return Result.fail(new UserAlreadyExistsError(signupDto.username));
    }

    const user = new User({
      name: signupDto.username,
      password: signupDto.password,
      role: roleSet.getReference(2),
    });
    await this.em.persistAndFlush(user);

    return Result.ok(this.createAccessToken(user));
  }

  public async login(
    loginDto: Login.Dto,
  ): Promise<Result<string, UsernameOrPasswordIsNotCorrect>> {
    const existingUser = await this.em.findOne<User>(User, {
      name: loginDto.username,
    });

    if (!existingUser) {
      return Result.fail(new UsernameOrPasswordIsNotCorrect());
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      existingUser.password,
    );
    if (!passwordMatch) {
      return Result.fail(new UsernameOrPasswordIsNotCorrect());
    }

    return Result.ok(this.createAccessToken(existingUser));
  }

  private createAccessToken(user: User) {
    return this.jwtService.sign({ name: user.name });
  }
}
