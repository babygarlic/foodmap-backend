import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {  IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    name: string

    @IsPhoneNumber('VN')
    phone: string

    @IsOptional()
    address: string

    @IsOptional()
    image: string 
}
