import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/guards/JwtGuard';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);

export const CurrentWsUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToWs().getClient().handshake;
    return request.user;
  },
);
