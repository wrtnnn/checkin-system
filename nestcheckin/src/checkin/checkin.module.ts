import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Checkin, CheckinSchema } from './schema/checkin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Checkin.name,
        schema: CheckinSchema
      }
    ])
  ],
  controllers: [CheckinController],
  providers: [CheckinService],
})
export class CheckinModule {}
