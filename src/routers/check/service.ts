import { web3 } from "../../provider/web3"
import ERC165_ABI  from '../../abi/ERC165.json';
import ERC20_ABI  from '../../abi/ERC20.json';
import { AbiItem } from "web3-utils";

const isEOA = async (address: string):Promise<boolean> => {
  try {
    const code = await web3.eth.getCode(address);
    if (code === '0x') return true;
  } catch {}
  return false;
}

const isNFT = async (address: string):Promise<boolean> => {
  try {
    const contract = new web3.eth.Contract(ERC165_ABI as AbiItem[], address);
    const isNFT = await contract.methods.supportsInterface('0x80ac58cd').call(); // erc721
    if (isNFT) return true;
  } catch {}
  return false;
}

const isMT = async (address: string):Promise<boolean> => {
  try {
    const contract = new web3.eth.Contract(ERC165_ABI as AbiItem[], address);
    const isMT = await contract.methods.supportsInterface('0xd9b67a26').call(); // erc721
    if (isMT) return true;
  } catch {}
  return false;
}

const isFT = async (address: string):Promise<boolean> => {
  try {
    const contract = new web3.eth.Contract(ERC20_ABI as AbiItem[], address);
    await Promise.all([
      await contract.methods.totalSupply().call(),
      await contract.methods.name().call(),
      await contract.methods.symbol().call(),
      await contract.methods.decimals().call()
    ]);
    return true;
  } catch {}
  return false;
}



export const checkAddressType = async (address: string): Promise<string> => {
  // check
  if (await isEOA(address)) return 'EOA';
  if (await isNFT(address)) return 'NFT';
  if (await isMT(address)) return 'MT';
  if (await isFT(address)) return 'FT';
  // smart contract
  return "CONTRACT";
}