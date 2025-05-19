import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";

export type CheckinDocument = Checkin & Document;

@Schema()
export class Checkin {
    
    @Prop({ require: true, type: Types.ObjectId, ref: "User" })
    user: ObjectId;

    @Prop({ require: true, type: Object })
    time: string;

}

export const CheckinSchema = SchemaFactory.createForClass(Checkin);