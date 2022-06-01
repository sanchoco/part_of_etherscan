import { IsDefined, IsEthereumAddress } from "class-validator";


export class AddressParam {
  @IsDefined()
  @IsEthereumAddress()
  address: string;
}