import { Controller, Request, Post, UseGuards, Headers } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { RefreshTokenGuard } from 'src/common/guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { User } from 'src/modules/user/entity/user.entity';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthenticationService } from '../service/auth.service';

@ApiTags('Authentication')
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok, the requested data was sent back',
  type: LoginResponseDto,
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({
    summary: 'login with email and password',
    description: 'login and return user data',
  })
  async loginByPassword(@Request() request): Promise<LoginResponseDto> {
    return await this.authenticationService.login(request.user);
  }

  @Post('/refresh')
  @ApiOperation({
    description:
      'this route is used to get a new access token and another refresh token',
    summary: 'refresh token',
  })
  @ApiHeader({ name: 'refresh-token' })
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @Headers('refresh-token') refreshToken,
    @CurrentUser() user: User,
  ): Promise<LoginResponseDto> {
    return this.authenticationService.refresh({ refreshToken, user });
  }
}
