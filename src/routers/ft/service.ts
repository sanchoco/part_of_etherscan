import { web3 } from "../../provider/web3"
import ERC20_ABI  from '../../abi/ERC20.json';
import { AbiItem } from "web3-utils";
import axios from "axios";

type Transfer = {
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  tokenId: number;
}

// info
export const getFtInfo = async (nftAddress: string) => {
  const ftContract = new web3.eth.Contract(ERC20_ABI as AbiItem[], nftAddress);
  const name = await ftContract.methods.name().call();
  const symbol = await ftContract.methods.symbol().call();
  const totalSupply = await ftContract.methods.totalSupply().call();

  return { contractAddress: nftAddress, name, symbol, totalSupply };
}

// transfers
export const getFtTransfers = async (nftAddress: string) => {
  const ftContract = new web3.eth.Contract(ERC20_ABI as AbiItem[], nftAddress);

  const fromBlock = 0;
  const toBlock = await web3.eth.getBlockNumber();
  const transfers: Transfer[] = [];

  let start = fromBlock;
  let end = toBlock;
  while (start <= end) {
    
    try {
      const events = await ftContract.getPastEvents('Transfer', { fromBlock: start, toBlock: end });
      transfers.push(...events.map((event) => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        from: event.returnValues.from,
        to: event.returnValues.to,
        tokenId: parseInt(event.returnValues.tokenId)
      })));
      start = end + 1;
      end = toBlock;
      if (start >= end) break;
    } catch (error){
      let mid =  parseInt(`${(start + end) / 2}`);
      end = mid;
    }
  }

  return { transfers: transfers.sort((a,b) => a.blockNumber - b.blockNumber) };
}

// owners
export const getFtOwners = async (nftAddress: string) => {
  const { transfers } = await getFtTransfers(nftAddress);
  const items = new Object();
  for (const transfer of transfers) {
    items[transfer.tokenId] = transfer.to;
  }
  const itemCount = new Object();
  for (const tokenId of Object.keys(items)) {
    const owner = items[tokenId];
    itemCount[owner] ? itemCount[owner] += 1 : itemCount[owner] = 1;
  }
  const owners = Object.keys(itemCount).map((address) => {
    return { address, itemCount: itemCount[address] };
  }).sort((a, b) => b.itemCount - a.itemCount);

  return { owners, count: owners.length };
}

// holders
export const getFtHolders = async (nftAddress: string) => {
  const { transfers } = await getFtTransfers(nftAddress);
  const items = new Object();
  for (const transfer of transfers) {
    items[transfer.tokenId] = transfer.to;
  }
  const holders = Object.keys(items)
    .map((tokenId) => ({ tokenId: parseInt(tokenId), owner: items[tokenId] }))
    .sort((a, b) => a.tokenId - b.tokenId)

  return { holders: holders, count: holders.length };
}