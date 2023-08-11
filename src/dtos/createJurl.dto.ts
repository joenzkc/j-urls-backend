import { IsDefined, IsUrl, Validate } from "class-validator";

export default class CreateJurlDto {
  @IsDefined()
  // only allow https urls
  @IsUrl({ protocols: ["https"] })
  url: string;
}
