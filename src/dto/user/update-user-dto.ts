import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';
import { IsString, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { roleEnum } from 'src/entity/user.entity';

export class DeleteUserDto extends PickType(CreateUserDto, [
    'password'
]){
    @IsString()
    @MinLength()
    @MaxLength()
    @Matches()
    readonly newPassword: string;

    @IsEnum()
    readonly newEnum : roleEnum
}