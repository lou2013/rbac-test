import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppAbility } from 'src/common/casl/casl-ability.factory';
import { CheckPolicies } from 'src/common/casl/policy-handler';
import { Action } from 'src/common/enum/casl-action.enum';
import { Resource } from 'src/common/enum/resource.enum';
import { DefaultAuth } from 'src/common/guards/default-auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@Controller('/')
@ApiTags('User')
@DefaultAuth()
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.USERS),
  )
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const data = await this.userService.create(createUserDto);

    return new UserDto(data);
  }

  @Get('/')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resource.USERS),
  )
  async find(): Promise<string> {
    return 'find all';
  }
}
