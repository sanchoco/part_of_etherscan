import { IsDefined, IsEthereumAddress } from "class-validator";


export class FtAddressParam {
  @IsDefined()
  @IsEthereumAddress()
  ftAddress: string;
}