import { IsDefined, IsOptional, IsString, IsUrl } from "class-validator";

export default class CreateJurlDto {
  @IsDefined()
  // only allow https urls
  @IsUrl({ protocols: ["https"] })
  url: string;

  @IsOptional()
  @IsString()
  customUrl: string;
}
