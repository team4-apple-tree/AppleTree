import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';
import { IsString, MinLength, MaxLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { roleEnum } from 'src/entity/user.entity';

export class UpdateUserDto extends PickType(CreateUserDto, [
    'password',
    'role',
    'desc',
]){
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
    @IsOptional()
    readonly newPassword: string | null

    @IsEnum(roleEnum)
    @IsOptional()
    readonly newEnum : roleEnum | null

    @IsString()
    @IsOptional()
    readonly desc: string | null

    // @IsString()
    // @IsOptional()
    // readonly password : string
}