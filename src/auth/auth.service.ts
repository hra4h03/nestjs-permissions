import { Get, Injectable, Post } from '@nestjs/common';
import { Signup } from '@/auth/dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '@aggregates/user/user.aggregate';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserAlreadyExistsError } from '@/auth/errors/UserAlreadyExists.error';
import { Role } from '@aggregates/user/role/role';
import { Login } from '@/auth/dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { UsernameOrPasswordIsNotCorrect } from '@/auth/errors/UsernameOrPasswordIsNotCorrect.error';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(signupDto: Signup.Dto) {
    const isExist = await this.userRepository.findOne({
      name: signupDto.username,
    });
    if (isExist) {
      throw new UserAlreadyExistsError(signupDto.username);
    }

    const user = new User({
      name: signupDto.username,
      password: signupDto.password,
      role: this.roleRepository.getReference(2),
    });
    await this.userRepository.persistAndFlush(user);

    return this.createAccessToken(user);
  }

  public async login(loginDto: Login.Dto): Promise<{ accessToken: string }> {
    const existingUser = await this.userRepository.findOne({
      name: loginDto.username,
    });

    if (!existingUser) throw new UsernameOrPasswordIsNotCorrect();

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      existingUser.password,
    );
    if (!passwordMatch) throw new UsernameOrPasswordIsNotCorrect();

    return this.createAccessToken(existingUser);
  }

  private createAccessToken(user: User): { accessToken: string } {
    return { accessToken: this.jwtService.sign({ name: user.name }) };
  }
}
