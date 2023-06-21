import { Module } from '@nestjs/common';
import { CommentController } from './controller/comment.controller';

@Module({ controllers: [CommentController] })
export class CommentModule {}
