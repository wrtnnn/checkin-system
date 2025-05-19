import { Injectable } from '@nestjs/common';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { Model } from 'mongoose';
import { Checkin } from './schema/checkin.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CheckinService {

  constructor(@InjectModel(Checkin.name) private checkinModel: Model<Document>) {}

  create(createCheckinDto: CreateCheckinDto) {
    return this.checkinModel.create(createCheckinDto);
  }

  findAll() {
    return this.checkinModel.find().populate('user').exec();
  }

  findById(id: string) {
    return this.checkinModel.findById(id).populate('user').exec();
  }

  update(id: string, updateCheckinDto: UpdateCheckinDto) {
    return this.checkinModel.findByIdAndUpdate(id, updateCheckinDto).exec();
  }

  remove(id: string) {
    return this.checkinModel.findByIdAndDelete(id).exec();
  }
}
