import { Module } from '@nestjs/common';
import { PositioningService } from './positioning.service';

@Module({
  providers: [PositioningService],
  exports: [PositioningService],
})
export class PositioningModule {}
