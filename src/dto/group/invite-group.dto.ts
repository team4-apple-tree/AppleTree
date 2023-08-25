import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteGroupDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
