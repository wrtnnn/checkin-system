import { IsEmpty, IsMongoId, IsString } from "class-validator";

export class CreateCheckinDto {
    @IsMongoId()
    @IsEmpty()
    user: string;
    
    @IsString()
    @IsEmpty()
    time: string;
    
}
