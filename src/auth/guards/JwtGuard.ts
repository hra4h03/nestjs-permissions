import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '@aggregates/user/user.aggregate';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Request } from 'express';
import { Loaded } from '@mikro-orm/core';

export interface RequestWithUser extends Request {
  user: Loaded<User, 'role.permissions'>;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = this.getRequest<RequestWithUser>(context);

    try {
      const token = this.getToken(request);
      const payload = this.jwtService.verify(token);

      request.user = await this.userRepository.findOne(
        { name: payload.name },
        {
          populate: ['role.permissions'],
        },
      );
      return true;
    } catch (e) {
      // return false or throw a specific error if desired
      return false;
    }
  }

  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }

  protected getToken(request: {
    headers: Record<string, string | string[]>;
  }): string {
    const authorization = request.headers['authorization'];
    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}

@Injectable()
export class WsJwtGuard extends JwtGuard {
  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToWs().getClient().handshake;
  }
}

export const UseJwtAuthGuard = () => UseGuards(JwtGuard);
export const UseWsJwtAuthGuard = () => UseGuards(WsJwtGuard);
