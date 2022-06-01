import { fromWei } from "web3-utils";
import { web3 } from "../../provider/web3"


export const getEoaInfo = async (address: string) => {
  const balance = await web3.eth.getBalance(address);
  const nonce = await web3.eth.getTransactionCount(address);

  return { address, balance: fromWei(balance), nonce: nonce };
}