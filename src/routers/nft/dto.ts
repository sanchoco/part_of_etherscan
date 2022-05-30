import { IsDefined, IsEthereumAddress } from "class-validator";


export class NftAddressParam {
  @IsDefined()
  @IsEthereumAddress()
  nftAddress: string;
}