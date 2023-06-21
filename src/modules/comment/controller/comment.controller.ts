import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/casl-ability.factory';
import { CheckPolicies } from 'src/common/casl/policy-handler';
import { Action } from 'src/common/enum/casl-action.enum';
import { Resource } from 'src/common/enum/resource.enum';
import { DefaultAuth } from 'src/common/guards/default-auth.guard';

@Controller('/')
@ApiTags('comment')
@DefaultAuth()
@ApiBearerAuth()
export class CommentController {
  @Get('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.COMMENTS),
  )
  findAll(): string {
    return 'all';
  }

  @Get('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.COMMENTS),
  )
  findById(@Param('id') id: string): string {
    return `found id :${{ id }}`;
  }

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resource.COMMENTS),
  )
  create(@Body() body: unknown): string {
    return `posted with body :${{ body }}`;
  }

  @Patch('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resource.COMMENTS),
  )
  update(@Body() body: unknown): string {
    return `updated with body :${{ body }}`;
  }

  @Delete('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Resource.COMMENTS),
  )
  delete(@Param('id') id: string): string {
    return `delete id :${{ id }}`;
  }
}
