import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '@/auth/guards/JwtGuard';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
