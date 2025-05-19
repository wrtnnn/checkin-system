import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Localization } from "src/type/Localization";
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop({require: true})
    name: string;

    @Prop({require: true, type: Object})
    role: Localization;

    @Prop({require: true})
    password: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});