import { web3 } from "../../provider/web3"
import ERC20_ABI  from '../../abi/ERC20.json';
import { AbiItem, isBigNumber, toBN } from "web3-utils";
import { EventData } from 'web3-eth-contract'
import NodeCache from "node-cache";

const serviceCache = new NodeCache();

type Transfer = {
  blockNumber: number;
  transactionHash: string;
  from: string;
  to: string;
  value: number;
}

// info
export const getFtInfo = async (nftAddress: string) => {
  const ftContract = new web3.eth.Contract(ERC20_ABI as AbiItem[], nftAddress);
  const name = await ftContract.methods.name().call();
  const symbol = await ftContract.methods.symbol().call();
  const totalSupply = await ftContract.methods.totalSupply().call();

  return { contractAddress: nftAddress, name, symbol, totalSupply };
}

const getEventLogs = async (nftAddress: string, start: number, end: number) => {
  const ftContract = new web3.eth.Contract(ERC20_ABI as AbiItem[], nftAddress);
  const decimals = await ftContract.methods.decimals().call() as number;
  const transfers: Transfer[] = [];
  const searchRange = [{ start, end }];

  while (searchRange.length) {
    const { start, end } = searchRange.pop();
    try {
      // common
      const events = await ftContract.getPastEvents('Transfer', { fromBlock: start, toBlock: end });
      if (!events) continue;
      const parsedEvents = events.map((event: EventData) => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        from: event.returnValues.from as string,
        to: event.returnValues.to as string,
        value: event.returnValues.value / (10**decimals)
      })).sort((a,b) => a.blockNumber - b.blockNumber);

      transfers.push(...parsedEvents);
    } catch (err) {
      if (err.message !== 'Returned error: query returned more than 10000 results') throw err;
      if (start === end) break;
      const mid =  parseInt(`${(start + end) / 2}`);
      searchRange.push({ start: mid + 1, end: end });
      searchRange.push({ start: start, end: mid });
    }
  }
  return transfers;
}

// transfers
export const getFtTransfers = async (ftAddress: string) => {
  const cacheKey = `ft_transfer_${ftAddress.toLowerCase()}`;
  const cache = serviceCache.get(cacheKey) as any;

  const toBlock = await web3.eth.getBlockNumber();
  const fromBlock = cache ? cache.lastBlock + 1 : 0;// toBlock - 1000// example
  
  const transfers = await getEventLogs(ftAddress, fromBlock, toBlock); // ERC20

  const allTransfers: Transfer[] = cache ? [...cache.transfers, ...transfers] : transfers;
  const result = { transfers: allTransfers , lastBlock: toBlock };
  serviceCache.set(cacheKey, result);
  return result;
}

// balances
export const getFtBalances = async (ftAddress: string) => {
  const { transfers } = await getFtTransfers(ftAddress);
  const values = new Object();
  for (const transfer of transfers) {
    const from = transfer.from;
    const to = transfer.to;
    const value = transfer.value;
    values[from] = values[from] && values[from] - value > 0 ? values[from] - value : 0;
    values[to] = values[to] ? values[to] + value : value;
  }
  const balances = new Array();
  for (const address of Object.keys(values)) {
    if (values[address] < 0.000001) continue;
    balances.push({ address, balance: values[address].toString() });
  }
  
  return { balances: balances.sort((a, b) => b.balance - a.balance) };
}

