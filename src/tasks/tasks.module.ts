import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Tenant } from '../tenants/entities/tenant.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    TypeOrmModule.forFeature([ Task, Tenant ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ]
})
export class TasksModule {}
