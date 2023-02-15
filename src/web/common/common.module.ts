import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { User } from '@aggregates/user/user.aggregate';
import { Permission } from '@aggregates/user/permission/permission';
import { ClaimFactory } from './claim/claim.factory';
import { PoliciesGuard } from './guards/PoliciesGuard';
import { RedisPubSubService } from '@/web/common/services/redis-pub-sub.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, Permission])],
  providers: [ClaimFactory, PoliciesGuard, RedisPubSubService],
  exports: [ClaimFactory, PoliciesGuard, RedisPubSubService],
})
export class CommonModule {}
