import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [AuthModule, UsersModule, TenantsModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
