import { IsDefined, IsUrl, Validate } from "class-validator";

export default class CreateJurlDto {
  @IsDefined()
  @IsUrl()
  url: string;
}
