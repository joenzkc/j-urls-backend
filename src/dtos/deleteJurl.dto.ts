import { IsDefined, IsString } from "class-validator";

export class DeleteJurlDto {
  @IsDefined()
  @IsString()
  hashedUrl: string;
}
