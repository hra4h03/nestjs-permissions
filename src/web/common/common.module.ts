import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { User } from '@aggregates/user/user.aggregate';
import { Permission } from '@aggregates/user/permission/permission';
import { ClaimFactory } from './claim/claim.factory';
import { PoliciesGuard } from './guards/PoliciesGuard';

@Module({
  imports: [MikroOrmModule.forFeature([User, Permission])],
  providers: [ClaimFactory, PoliciesGuard],
  exports: [ClaimFactory, PoliciesGuard],
})
export class CommonModule {}
