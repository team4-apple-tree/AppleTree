import {
  Matches,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { roleEnum } from 'src/entity/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: '이메일 형식으로 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message: '대문자, 소문자, 숫자를 조합하여서 만들어 주세요.',
  })
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  readonly password: string;

  @MinLength(4)
  @MaxLength(10)
  @Matches(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/, {
    message: '대문자, 소문자, 숫자를 조합하여서 만들어 주세요.',
  })
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  readonly confirm: string;

  @IsString()
  @IsOptional()
  desc: string | null;

  @IsEnum(roleEnum)
  @IsOptional()
  readonly role: roleEnum | null;
  state: roleEnum;
}
