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
@ApiTags('product')
@DefaultAuth()
@ApiBearerAuth()
export class ProductController {
  @Get('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.PRODUCTS),
  )
  findAll(): string {
    return 'all';
  }

  @Get('/:id')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.PRODUCTS),
  )
  findById(@Param('id') id: string): string {
    return `found id :${{ id }}`;
  }

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resource.PRODUCTS),
  )
  create(@Body() body: unknown): string {
    return `posted with body :${{ body }}`;
  }

  @Patch('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resource.PRODUCTS),
  )
  update(@Body() body: unknown): string {
    return `updated with body :${{ body }}`;
  }

  @Delete('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, Resource.PRODUCTS),
  )
  delete(@Param('id') id: string): string {
    return `delete id :${{ id }}`;
  }
}
