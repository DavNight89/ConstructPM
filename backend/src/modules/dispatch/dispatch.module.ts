import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DispatchGateway } from './dispatch.gateway';
import { Job } from '../../database/entities/job.entity';
import { Worker } from '../../database/entities/worker.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job, Worker]), AuthModule],
  controllers: [DispatchController],
  providers: [DispatchService, DispatchGateway],
  exports: [DispatchService, DispatchGateway],
})
export class DispatchModule {}
