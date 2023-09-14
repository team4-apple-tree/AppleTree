import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { roleEnum } from 'src/entity/user.entity';

export class UpdateUserDto extends PickType(CreateUserDto, ['name', 'desc']) {
  @IsString()
  @IsOptional()
  profileImage: string;
}

// export class UpdateUserDto {
//   @IsString()
//   @Length(1)
//   @IsNotEmpty({ message: '이름을 입력해주세요.' })
//   readonly name: string;

//   @IsString()
//   // @IsOptional()
//   readonly desc: string | null;

//   @IsString()
//   @IsOptional()
//   profileImage: string;
// }
