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
import { DefaultAuth } from 'src/common/guards/default-auth.guard';

@Controller('/')
@ApiTags('order')
@DefaultAuth()
@ApiBearerAuth()
export class OrderController {
  @Get('/')
  findAll(): string {
    return 'all';
  }

  @Get('/:id')
  findById(@Param('id') id: string): string {
    return `found id :${{ id }}`;
  }

  @Post('/')
  create(@Body() body: any): string {
    return `posted with body :${{ body }}`;
  }

  @Patch('/')
  update(@Body() body: any): string {
    return `updated with body :${{ body }}`;
  }

  @Delete('/')
  delete(@Param('id') id: string): string {
    return `delete id :${{ id }}`;
  }
}
