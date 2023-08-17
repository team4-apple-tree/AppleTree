import {
    Matches,
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    IsEnum,
    IsOptional
  } from 'class-validator';
  import { roleEnum } from 'src/entity/user.entity';

  export class CreateUserDto{
    @IsEmail()
    readonly email : string
    
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
    readonly password : string

    @IsString()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
    readonly confirm : string

    @IsString()
    readonly name : string

    @IsEnum(roleEnum)
    @IsOptional()
    readonly role : roleEnum | null
    state : roleEnum

  }