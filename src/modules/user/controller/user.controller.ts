import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/casl-ability.factory';
import { CheckPolicies } from 'src/common/casl/policy-handler';
import { Action } from 'src/common/enum/casl-action.enum';
import { Resource } from 'src/common/enum/resource.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MakeAbilityGuard } from 'src/common/guards/make-ability.guard';
import { PoliciesGuard } from 'src/common/guards/policy.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@Controller('/')
@ApiTags('User')
@UseGuards(JwtAuthGuard, MakeAbilityGuard, PoliciesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.USERS),
  )
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.create(createUserDto);
  }
}
