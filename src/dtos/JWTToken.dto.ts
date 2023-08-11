import { IsDateString, IsDefined, IsString } from "class-validator";

export class JwtTokenDto {
  @IsDefined()
  @IsString()
  userId: string;

  @IsDefined()
  @IsDateString()
  expiresIn: string;
}
