import { IsDefined, IsString } from "class-validator";

export class LoginDto {
  @IsDefined()
  @IsString()
  public username: string;

  @IsDefined()
  @IsString()
  public password: string;
}
