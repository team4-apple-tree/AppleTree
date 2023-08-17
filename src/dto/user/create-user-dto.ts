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
    @MinLength()
    @MaxLength()
    @Matches()
    readonly password : string

    @IsString()
    @MinLength()
    @MaxLength()
    @Matches()
    readonly confirm : string

    @IsString()
    readonly name : string

    @IsEnum()
    @IsOptional()
    readonly role : roleEnum | null
    state : roleEnum

  }