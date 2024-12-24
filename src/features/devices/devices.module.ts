import { Module } from '@nestjs/common';
import { DevicesController } from './api/devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesRepository } from './infrastructure/devices.repository';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { DevicesCommandHandlers } from './application/useCases';
import { DevicesRepositoryTO } from './infrastructure/devices.repository.to';
import { DeviceEntity } from './domain/devices.entity';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    TypeOrmModule.forFeature([DeviceEntity]),
  ],
  controllers: [DevicesController],
  providers: [
    DevicesRepository,
    DevicesRepositoryTO,
    ...DevicesCommandHandlers,
  ],
  exports: [
    DevicesRepository,
    DevicesRepositoryTO,
    ...DevicesCommandHandlers,
  ],
})
export class DevicesModule {
}
