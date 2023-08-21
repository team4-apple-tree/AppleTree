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

export class CreateGroupDto {
  @IsString({ message: '스터디그룹 이름은 문자열이여야 합니다.' })
  @IsNotEmpty({ message: '스터디그룹 이름을 입력해주세요.' })
  readonly name: string;

  @IsString({ message: '스터디그룹 설명은 문자열이여야 합니다.' })
  @IsNotEmpty({ message: '스터디그룹 설명을 입력해주세요.' })
  readonly desc: string;

  @IsString()
  readonly image: string;
}
