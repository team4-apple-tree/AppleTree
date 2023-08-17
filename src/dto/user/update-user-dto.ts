import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';
import { IsString, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';
import { roleEnum } from 'src/entity/user.entity';

export class DeleteUserDto extends PickType(CreateUserDto, [
    'password'
]){
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
    readonly newPassword: string;

    @IsEnum(roleEnum)
    readonly newEnum : roleEnum
}