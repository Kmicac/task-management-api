import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      autoLoadEntities: true,
      synchronize: true,
    
    }),
 
    UsersModule, 
    TenantsModule, 
    TasksModule
  ],
})
export class AppModule {}
